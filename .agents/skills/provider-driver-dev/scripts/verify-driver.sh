#!/usr/bin/env bash
set -euo pipefail

echo "========================================================"
echo "  Padu Provider Driver Verification Suite"
echo "========================================================"

echo "[1/4] Checking Rust workspace compilation..."
cargo check --workspace

echo "[2/4] Running provider driver unit tests..."
cargo test --package padu-core --lib driver

echo "[3/4] Checking protocol TypeScript bindings parity..."
bun run protocol:check

echo "[4/4] Verifying provider test CLI..."
cargo run -p padu-daemon --bin padu-provider-test -- list

echo ""
echo "✓ All provider driver verification checks passed!"
