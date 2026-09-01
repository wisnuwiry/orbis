import { describe, expect, test } from "bun:test";

import {
  DAEMON_RECONNECT_DELAY_MS,
  nextDaemonReconnectAttempt,
} from "./daemon-retry";

describe("daemon auto reconnect", () => {
  test("retries every five seconds at most three times", () => {
    const attempts: number[] = [];
    let completedAttempts = 0;

    while (true) {
      const nextAttempt = nextDaemonReconnectAttempt(completedAttempts);
      if (nextAttempt === null) break;
      attempts.push(nextAttempt);
      completedAttempts = nextAttempt;
    }

    expect(DAEMON_RECONNECT_DELAY_MS).toBe(5_000);
    expect(attempts).toEqual([1, 2, 3]);
    expect(nextDaemonReconnectAttempt(completedAttempts)).toBeNull();
  });
});
