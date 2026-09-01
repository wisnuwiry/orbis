import { describe, expect, test } from 'bun:test';
import type { AgentSession, Project, SequencedEvent } from '@padu/client';

import {
  applySessionOptions,
  beginTurn,
  createSession,
  queueSubmission,
  runtimeEventAlreadyApplied,
  sessionBusy,
  sessionCwd,
  shouldApplyRuntimeEvent,
} from './mobile-runtime';

describe('mobile runtime projection', () => {
  test('begins a turn with a user message and prompt-derived title', () => {
    let id = 0;
    const started = beginTurn(session(), '  Fix the mobile reconnect race  ', {
      nowSeconds: () => 42,
      randomUUID: () => `id-${++id}`,
    });
    expect(started.status).toBe('connecting');
    expect(started.auto_title).toBe('Fix the mobile reconnect race');
    expect(started.messages.at(-1)).toMatchObject({
      id: 'id-2',
      turn_id: 'id-1',
      content: 'Fix the mobile reconnect race',
      created_at: 42,
    });
    expect(started.turns.at(-1)).toMatchObject({ id: 'id-1', status: 'running' });
  });

  test('uses a worktree path and rejects replayed runtime events', () => {
    const project: Project = { id: 'p', name: 'Padu', path: '/padu', created_at: 1 };
    const current = session({
      workspace: { kind: 'worktree', path: '/padu-worktree', branch: 'mobile' },
      runtime_event_cursor: { runtime_id: 'runtime', epoch: 'epoch', sequence: 4 },
    });
    const event = {
      sessionId: current.id,
      runtimeId: 'runtime',
      epoch: 'epoch',
      sequence: 4,
      event: { kind: 'textDelta', payload: 'duplicate' },
    } satisfies SequencedEvent;
    expect(sessionCwd(current, project)).toBe('/padu-worktree');
    expect(runtimeEventAlreadyApplied(current, event)).toBe(true);
  });

  test('replays a pending control request after an app restart', () => {
    const current = session({
      status: 'waiting',
      runtime_event_cursor: { runtime_id: 'runtime', epoch: 'epoch', sequence: 4 },
    });
    const permission = {
      sessionId: current.id,
      runtimeId: 'runtime',
      epoch: 'epoch',
      sequence: 4,
      event: { kind: 'permission', payload: {} },
    } satisfies SequencedEvent;
    const text = {
      ...permission,
      event: { kind: 'textDelta', payload: 'duplicate' },
    } satisfies SequencedEvent;
    expect(shouldApplyRuntimeEvent(current, permission)).toBe(true);
    expect(shouldApplyRuntimeEvent(current, text)).toBe(false);
    expect(shouldApplyRuntimeEvent({ ...current, status: 'working' }, permission)).toBe(false);
  });

  test('creates a provider-neutral isolated draft', () => {
    const created = createSession('project', 'claude', true, {
      nowSeconds: () => 50,
      randomUUID: () => 'new-session',
    });
    expect(created).toMatchObject({
      id: 'new-session',
      project_id: 'project',
      provider: 'claude',
      workspace: { kind: 'newWorktree' },
      runtime_mode: 'fullAccess',
      status: 'idle',
    });
  });

  test('creates a draft carrying the chosen model and access mode', () => {
    const created = createSession('project', 'codex', false, {
      nowSeconds: () => 50,
      randomUUID: () => 'new-session',
    }, {
      model: 'gpt-5-codex',
      reasoningEffort: 'high',
      runtimeMode: 'ask',
    });
    expect(created).toMatchObject({
      model: 'gpt-5-codex',
      reasoning_effort: 'high',
      runtime_mode: 'ask',
    });
  });

  test('queues a submission while a turn is live', () => {
    let id = 0;
    const busy = session({ status: 'working' });
    expect(sessionBusy(busy)).toBe(true);
    const queued = queueSubmission(busy, 'follow up', {
      nowSeconds: () => 99,
      randomUUID: () => `queued-${++id}`,
    });
    expect(queued.queued_messages).toEqual([{
      id: 'queued-1',
      content: 'follow up',
      display_content: null,
      attachments: [],
      created_at: 99,
    }]);
    expect(queued.updated_at).toBe(99);
    expect(busy.queued_messages ?? []).toEqual([]);
  });

  test('applies option changes without clobbering unrelated fields', () => {
    const current = session({ model: 'old', reasoning_effort: 'low' });
    const next = applySessionOptions(current, { model: 'new-model' }, {
      nowSeconds: () => 77,
      randomUUID: () => 'unused',
    });
    expect(next.model).toBe('new-model');
    expect(next.reasoning_effort).toBe('low');
    expect(next.runtime_mode).toBe(current.runtime_mode);
    expect(next.updated_at).toBe(77);
    const cleared = applySessionOptions(current, { model: null, reasoningEffort: null }, {
      nowSeconds: () => 78,
      randomUUID: () => 'unused',
    });
    expect(cleared.model).toBeNull();
    expect(cleared.reasoning_effort).toBeNull();
  });
});

function session(overrides: Partial<AgentSession> = {}): AgentSession {
  return {
    id: 'session',
    title: 'New task',
    auto_title: null,
    project_id: 'p',
    workspace: { kind: 'local' },
    provider: 'codex',
    runtime_mode: 'fullAccess',
    interaction_mode: 'build',
    status: 'idle',
    created_at: 1,
    updated_at: 1,
    last_reply_at: null,
    provider_cursor: null,
    messages: [],
    transcript_blocks: [],
    turns: [],
    ...overrides,
  };
}
