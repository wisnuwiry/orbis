import { describe, expect, test } from 'bun:test';
import type { AgentSession, AgentTurn, Project } from '@padu/client';

import {
  displaySessionTitle,
  buildTranscriptRows,
  contextPercent,
  groupSessions,
  relativeSessionTime,
  sessionDateGroup,
} from './session-presentation';

describe('mobile session presentation', () => {
  test('uses provider title for untouched tasks', () => {
    expect(displaySessionTitle(session({ title: 'New task', auto_title: 'Fix login' }))).toBe(
      'Fix login',
    );
  });

  test('groups started sessions by local day and newest first', () => {
    const now = new Date(2026, 7, 31, 12);
    const projects: Project[] = [{ id: 'project', name: 'Padu', path: '/padu', created_at: 1 }];
    const current = session({ id: 'new', last_reply_at: epoch(2026, 7, 31, 11) });
    const yesterday = session({ id: 'old', last_reply_at: epoch(2026, 7, 30, 20) });
    const empty = session({ id: 'empty', last_reply_at: null, messages: [], turns: [] });
    expect(groupSessions(projects, [yesterday, empty, current], now).map((group) => ({
      id: group.id,
      sessions: group.data.map((item) => item.session.id),
    }))).toEqual([
      { id: 'today', sessions: ['new'] },
      { id: 'yesterday', sessions: ['old'] },
    ]);
  });

  test('formats compact recency labels', () => {
    expect(relativeSessionTime(1_000, 1_030_000)).toBe('Now');
    expect(relativeSessionTime(1_000, 1_300_000)).toBe('5m');
    expect(sessionDateGroup(epoch(2026, 7, 24, 12), new Date(2026, 7, 31, 12))).toBe('week');
  });

  test('reports context usage as a bounded percentage', () => {
    expect(contextPercent(session({}))).toBeNull();
    expect(contextPercent(session({ context_usage: { tokens: 50_000, window: 200_000 } }))).toBe(25);
    expect(contextPercent(session({ context_usage: { tokens: 500, window: null } }))).toBeNull();
  });

  test('keeps provider ordering inline when the turn is unknown', () => {
    const current = session({
      messages: [
        { id: 'user', turn_id: 'turn', role: 'user', content: 'go', created_at: 1, streaming: false },
        { id: 'agent', turn_id: 'turn', role: 'assistant', content: 'done', created_at: 2, streaming: false },
      ],
      transcript_blocks: [activityBlock(1, 'turn')],
    });
    expect(buildTranscriptRows(current).map((row) => row.kind)).toEqual([
      'message',
      'activities',
      'message',
    ]);
  });

  test('folds a settled turn behind “Worked for X” like the desktop', () => {
    const current = session({
      turns: [turn({ id: 'turn', status: 'completed', started_at: 10, completed_at: 130 })],
      messages: [
        { id: 'user', turn_id: 'turn', role: 'user', content: 'go', created_at: 1, streaming: false },
        { id: 'agent', turn_id: 'turn', role: 'assistant', content: 'done', created_at: 2, streaming: false },
      ],
      transcript_blocks: [activityBlock(1, 'turn')],
    });
    const collapsed = buildTranscriptRows(current);
    expect(collapsed.map((row) => row.kind)).toEqual(['message', 'fold', 'message']);
    const fold = collapsed[1]!;
    if (fold.kind !== 'fold') throw new Error('expected fold');
    expect(fold.label).toBe('Worked for 2 minutes');
    const answer = collapsed[2]!;
    if (answer.kind !== 'message') throw new Error('expected message');
    expect(answer.footerTimestamp).toBe(130);

    const expanded = buildTranscriptRows(current, new Set(['turn']));
    expect(expanded.map((row) => row.kind)).toEqual(['message', 'fold', 'activities', 'message']);
  });

  test('folds thoughts too — a thought-only turn shows just the answer', () => {
    const current = session({
      turns: [turn({ id: 'turn', status: 'completed', started_at: 10, completed_at: 15 })],
      messages: [
        { id: 'user', turn_id: 'turn', role: 'user', content: 'hi', created_at: 1, streaming: false },
        { id: 'agent', turn_id: 'turn', role: 'assistant', content: 'Hi!', created_at: 2, streaming: false },
      ],
      transcript_blocks: [{
        after_message: 1,
        turn_id: 'turn',
        content: {
          kind: 'activities',
          data: [{
            id: 'thought',
            source_id: null,
            kind: 'reasoning',
            title: 'Reasoning',
            detail: null,
            failed: false,
            complete: true,
            reasoning: { content: 'Preparing greeting', started_at_ms: 0, finished_at_ms: 900 },
          }],
        },
      }],
    });
    expect(buildTranscriptRows(current).map((row) => row.kind)).toEqual([
      'message',
      'fold',
      'message',
    ]);
  });

  test('hides intermediate text parts — only the terminal answer stays visible', () => {
    const current = session({
      turns: [turn({ id: 'turn', status: 'completed', started_at: 10, completed_at: 40 })],
      messages: [
        { id: 'user', turn_id: 'turn', role: 'user', content: 'go', created_at: 1, streaming: false },
        { id: 'part1', turn_id: 'turn', role: 'assistant', content: 'First part.', created_at: 2, streaming: false },
        { id: 'part2', turn_id: 'turn', role: 'assistant', content: 'Final answer.', created_at: 3, streaming: false },
      ],
      transcript_blocks: [activityBlock(2, 'turn')],
    });
    const collapsed = buildTranscriptRows(current);
    expect(collapsed.map((row) => (
      row.kind === 'message' ? `message:${row.message.id}` : row.kind
    ))).toEqual(['message:user', 'fold', 'message:part2']);
    const answer = collapsed[2]!;
    if (answer.kind !== 'message') throw new Error('expected message');
    expect(answer.footerTimestamp).toBe(40);

    const expanded = buildTranscriptRows(current, new Set(['turn']));
    expect(expanded.map((row) => (
      row.kind === 'message' ? `message:${row.message.id}` : row.kind
    ))).toEqual(['message:user', 'fold', 'message:part1', 'activities', 'message:part2']);
  });

  test('keeps a running turn’s work expanded and live', () => {
    const current = session({
      status: 'working',
      turns: [turn({ id: 'turn', status: 'running', started_at: 10, completed_at: null })],
      messages: [
        { id: 'user', turn_id: 'turn', role: 'user', content: 'go', created_at: 1, streaming: false },
      ],
      transcript_blocks: [activityBlock(1, 'turn')],
    });
    const rows = buildTranscriptRows(current);
    expect(rows.map((row) => row.kind)).toEqual(['message', 'activities']);
    const activities = rows[1]!;
    if (activities.kind !== 'activities') throw new Error('expected activities');
    expect(activities.live).toBe(true);
  });

  test('emits a changed-files card after a checkpointed turn', () => {
    const current = session({
      turns: [turn({
        id: 'turn',
        status: 'completed',
        started_at: 10,
        completed_at: 70,
        checkpoint: {
          turn_count: 1,
          git_ref: 'refs/padu/x',
          status: 'ready',
          files: [{ path: 'src/a.ts', additions: 3, deletions: 1 }],
          additions: 3,
          deletions: 1,
          created_at: 70,
        },
      })],
      messages: [
        { id: 'user', turn_id: 'turn', role: 'user', content: 'go', created_at: 1, streaming: false },
        { id: 'agent', turn_id: 'turn', role: 'assistant', content: 'done', created_at: 2, streaming: false },
      ],
      transcript_blocks: [],
    });
    expect(buildTranscriptRows(current).map((row) => row.kind)).toEqual([
      'message',
      'message',
      'changed',
    ]);
  });
});

function activityBlock(afterMessage: number, turnId: string): AgentSession['transcript_blocks'][number] {
  return {
    after_message: afterMessage,
    turn_id: turnId,
    content: {
      kind: 'activities',
      data: [{
        id: 'tool',
        source_id: null,
        kind: 'command',
        title: 'Run tests',
        detail: null,
        failed: false,
        complete: true,
      }],
    },
  };
}

function turn(overrides: Partial<AgentTurn> & Pick<AgentTurn, 'id' | 'status'>): AgentTurn {
  return {
    turn_count: 1,
    provider_turn_started: true,
    provider_resume_at: null,
    started_at: 1,
    completed_at: 2,
    checkpoint: null,
    ...overrides,
  };
}

function session(overrides: Partial<AgentSession>): AgentSession {
  return {
    id: 'session',
    title: 'Task',
    project_id: 'project',
    provider: 'codex',
    runtime_mode: 'autoAcceptEdits',
    interaction_mode: 'build',
    status: 'idle',
    created_at: 1,
    updated_at: 1,
    last_reply_at: 1,
    provider_cursor: null,
    messages: [{
      id: 'message',
      turn_id: null,
      role: 'user',
      content: 'hello',
      created_at: 1,
      streaming: false,
    }],
    transcript_blocks: [],
    turns: [],
    ...overrides,
  };
}

function epoch(year: number, month: number, day: number, hour: number) {
  return Math.floor(new Date(year, month, day, hour).getTime() / 1_000);
}
