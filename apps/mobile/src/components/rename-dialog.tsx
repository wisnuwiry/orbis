import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { NativeTint, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Cross-platform "rename task" prompt (Alert.prompt is iOS-only). */
export function RenameDialog({
  visible,
  initialValue,
  onDismiss,
  onSubmit,
}: {
  visible: boolean;
  initialValue: string;
  onDismiss: () => void;
  onSubmit: (title: string) => Promise<void>;
}) {
  const theme = useTheme();
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setValue(initialValue);
      setSaving(false);
      setError(null);
    }
  }, [initialValue, visible]);

  async function save() {
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      await onSubmit(value);
      onDismiss();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
      setSaving(false);
    }
  }

  return (
    <Modal animationType="fade" onRequestClose={onDismiss} transparent visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.frame}>
        <Pressable
          accessibilityLabel="Dismiss"
          onPress={onDismiss}
          style={[styles.backdrop, { backgroundColor: theme.shadow }]}
        />
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>Rename task</Text>
          <TextInput
            accessibilityLabel="Task title"
            autoFocus
            onChangeText={setValue}
            onSubmitEditing={() => void save()}
            placeholder="Task title"
            placeholderTextColor={theme.textTertiary}
            returnKeyType="done"
            selectTextOnFocus
            selectionColor={NativeTint}
            style={[
              styles.input,
              { backgroundColor: theme.inset, borderColor: theme.border, color: theme.text },
            ]}
            value={value}
          />
          {error && <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>}
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={saving}
              onPress={onDismiss}
              style={({ pressed }) => [styles.button, { opacity: pressed ? 0.5 : 1 }]}>
              <Text style={[styles.buttonText, { color: theme.textSecondary }]}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={saving}
              onPress={() => void save()}
              style={({ pressed }) => [
                styles.button,
                styles.primaryButton,
                { backgroundColor: theme.inverse, opacity: pressed || saving ? 0.6 : 1 },
              ]}>
              {saving && <ActivityIndicator color={theme.onInverse} size="small" />}
              <Text style={[styles.buttonText, { color: theme.onInverse }]}>Save</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  frame: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 28 },
  backdrop: { bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 },
  card: {
    borderRadius: Radius.large,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: 420,
    padding: 18,
    width: '100%',
  },
  title: { fontSize: 16, fontWeight: '700' },
  input: {
    borderRadius: Radius.small,
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 15,
    marginTop: 13,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  error: { fontSize: 12.5, lineHeight: 17, marginTop: 9 },
  actions: { flexDirection: 'row', gap: 9, justifyContent: 'flex-end', marginTop: 15 },
  button: {
    alignItems: 'center',
    borderRadius: Radius.pill,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 16,
  },
  primaryButton: { minWidth: 84 },
  buttonText: { fontSize: 14.5, fontWeight: '600' },
});
