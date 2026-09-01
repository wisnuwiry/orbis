export type DiffLineKind = 'hunk' | 'add' | 'remove' | 'context';

export interface DiffLine {
  kind: DiffLineKind;
  text: string;
}

const MAX_DIFF_LINES = 400;

/**
 * Parses the normalized unified diff carried on ActivityFileChange.diff.
 * File headers are dropped (the surrounding UI already names the file) and
 * hunk headers may be a bare `@@` when the provider never reported positions.
 */
export function parseUnifiedDiff(diff: string): { lines: DiffLine[]; truncated: boolean } {
  const lines: DiffLine[] = [];
  let truncated = false;
  for (const raw of diff.split('\n')) {
    if (lines.length >= MAX_DIFF_LINES) {
      truncated = true;
      break;
    }
    if (
      raw.startsWith('diff --git') || raw.startsWith('index ') ||
      raw.startsWith('--- ') || raw.startsWith('+++ ') ||
      raw === '---' || raw === '+++' || raw.startsWith('\\ No newline')
    ) {
      continue;
    }
    if (raw.startsWith('@@')) {
      lines.push({ kind: 'hunk', text: raw.trim() });
      continue;
    }
    if (raw.startsWith('+')) {
      lines.push({ kind: 'add', text: raw.slice(1) });
      continue;
    }
    if (raw.startsWith('-')) {
      lines.push({ kind: 'remove', text: raw.slice(1) });
      continue;
    }
    lines.push({ kind: 'context', text: raw.startsWith(' ') ? raw.slice(1) : raw });
  }
  while (lines.length && lines.at(-1)!.text === '' && lines.at(-1)!.kind === 'context') {
    lines.pop();
  }
  return { lines, truncated };
}

export function diffStats(lines: DiffLine[]): { additions: number; deletions: number } {
  let additions = 0;
  let deletions = 0;
  for (const line of lines) {
    if (line.kind === 'add') additions += 1;
    else if (line.kind === 'remove') deletions += 1;
  }
  return { additions, deletions };
}
