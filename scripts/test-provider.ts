#!/usr/bin/env bun

/**
 * Provider Test Runner
 *
 * Convenience wrapper around the native `padu-provider-test` CLI harness.
 *
 * Examples:
 *   bun ./scripts/test-provider.ts list
 *   bun ./scripts/test-provider.ts probe claude
 *   bun ./scripts/test-provider.ts models claude
 *   bun ./scripts/test-provider.ts connect claude
 *   bun ./scripts/test-provider.ts turn claude "Reply with PONG"
 *   bun ./scripts/test-provider.ts suite claude
 */

import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const args = process.argv.slice(2);

const result = spawnSync(
  "cargo",
  ["run", "-p", "padu-daemon", "--bin", "padu-provider-test", "--quiet", "--", ...args],
  {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  },
);

process.exit(result.status ?? 1);
