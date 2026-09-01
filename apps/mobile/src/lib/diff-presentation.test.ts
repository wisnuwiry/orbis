import { describe, expect, test } from 'bun:test';

import { diffStats, parseUnifiedDiff } from './diff-presentation';

describe('unified diff parsing', () => {
  test('classifies added, removed, context, and hunk lines', () => {
    const { lines, truncated } = parseUnifiedDiff([
      '--- a/src/a.ts',
      '+++ b/src/a.ts',
      '@@ -1,3 +1,3 @@',
      ' unchanged',
      '-old line',
      '+new line',
    ].join('\n'));
    expect(truncated).toBe(false);
    expect(lines).toEqual([
      { kind: 'hunk', text: '@@ -1,3 +1,3 @@' },
      { kind: 'context', text: 'unchanged' },
      { kind: 'remove', text: 'old line' },
      { kind: 'add', text: 'new line' },
    ]);
    expect(diffStats(lines)).toEqual({ additions: 1, deletions: 1 });
  });

  test('accepts bare @@ hunks from string-replacement edit tools', () => {
    const { lines } = parseUnifiedDiff('@@\n-before\n+after');
    expect(lines.map((line) => line.kind)).toEqual(['hunk', 'remove', 'add']);
  });

  test('drops git headers and no-newline markers', () => {
    const { lines } = parseUnifiedDiff([
      'diff --git a/x b/x',
      'index 123..456 100644',
      '--- a/x',
      '+++ b/x',
      '@@ -1 +1 @@',
      '-a',
      '+b',
      '\\ No newline at end of file',
    ].join('\n'));
    expect(lines.map((line) => line.kind)).toEqual(['hunk', 'remove', 'add']);
  });

  test('truncates very large diffs', () => {
    const body = Array.from({ length: 500 }, (_, index) => `+line ${index}`).join('\n');
    const { lines, truncated } = parseUnifiedDiff(`@@\n${body}`);
    expect(truncated).toBe(true);
    expect(lines.length).toBe(400);
  });
});
