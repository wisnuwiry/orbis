import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { MonoFont, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { parseUnifiedDiff, type DiffLine } from '@/lib/diff-presentation';

/** Colored unified-diff body rendered into an inset code well. */
export function DiffView({ diff }: { diff: string }) {
  const theme = useTheme();
  const { lines, truncated } = useMemo(() => parseUnifiedDiff(diff), [diff]);
  if (!lines.length) return null;
  return (
    <View style={[styles.well, { backgroundColor: theme.inset, borderColor: theme.border }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.lines}>
          {lines.map((line, index) => (
            <DiffRow key={index} line={line} />
          ))}
          {truncated && (
            <Text style={[styles.truncated, { color: theme.textTertiary }]}>
              … diff truncated
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function DiffRow({ line }: { line: DiffLine }) {
  const theme = useTheme();
  if (line.kind === 'hunk') {
    return (
      <Text style={[styles.line, styles.hunk, { color: theme.textTertiary }]}>{line.text}</Text>
    );
  }
  const background = line.kind === 'add'
    ? theme.successSoft
    : line.kind === 'remove'
      ? theme.dangerSoft
      : 'transparent';
  const color = line.kind === 'add'
    ? theme.success
    : line.kind === 'remove'
      ? theme.danger
      : theme.textSecondary;
  const marker = line.kind === 'add' ? '+' : line.kind === 'remove' ? '−' : ' ';
  return (
    <View style={[styles.row, { backgroundColor: background }]}>
      <Text style={[styles.marker, { color }]}>{marker}</Text>
      <Text style={[styles.line, { color }]}>{line.text || ' '}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  well: {
    borderRadius: Radius.small,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    paddingVertical: 6,
  },
  lines: { minWidth: '100%', paddingHorizontal: 8 },
  row: { borderRadius: 3, flexDirection: 'row', paddingRight: 10 },
  marker: { fontFamily: MonoFont, fontSize: 11, lineHeight: 16.5, width: 12 },
  line: { fontFamily: MonoFont, fontSize: 11, lineHeight: 16.5 },
  hunk: { fontFamily: MonoFont, fontSize: 10.5, lineHeight: 18, marginVertical: 2 },
  truncated: { fontSize: 10.5, marginTop: 4 },
});
