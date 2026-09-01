import { useLocalSearchParams } from 'expo-router';

import { SessionView } from '@/components/session-view';

export default function SessionScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const sessionId = Array.isArray(params.id) ? params.id[0] : params.id;
  return <SessionView sessionId={sessionId} />;
}
