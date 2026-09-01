import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import type { ConnectionPhase } from '@/lib/daemon-context';

export function ConnectionStatus({
  phase,
  compact = false,
}: {
  phase: ConnectionPhase;
  compact?: boolean;
}) {
  const theme = useTheme();
  const presentation = statusPresentation(phase, theme);
  return (
    <View style={styles.container}>
      {phase === 'connecting' || phase === 'booting' ? (
        <ActivityIndicator color={presentation.color} size="small" style={styles.spinner} />
      ) : (
        <View style={[styles.dot, { backgroundColor: presentation.color }]} />
      )}
      {!compact && (
        <Text style={[styles.label, { color: presentation.color }]}>{presentation.label}</Text>
      )}
    </View>
  );
}

function statusPresentation(
  phase: ConnectionPhase,
  theme: ReturnType<typeof useTheme>,
) {
  switch (phase) {
    case 'connected':
      return { label: 'Connected', color: theme.success };
    case 'connecting':
    case 'booting':
      return { label: 'Connecting', color: theme.warning };
    case 'error':
      return { label: 'Needs attention', color: theme.danger };
    default:
      return { label: 'Offline', color: theme.textTertiary };
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  spinner: {
    height: 12,
    transform: [{ scale: 0.66 }],
    width: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
