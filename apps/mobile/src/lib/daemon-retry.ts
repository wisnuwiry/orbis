export const DAEMON_RECONNECT_DELAY_MS = 5_000;
export const DAEMON_AUTO_RECONNECT_LIMIT = 3;

export function nextDaemonReconnectAttempt(
  completedAttempts: number,
): number | null {
  return completedAttempts < DAEMON_AUTO_RECONNECT_LIMIT
    ? completedAttempts + 1
    : null;
}
