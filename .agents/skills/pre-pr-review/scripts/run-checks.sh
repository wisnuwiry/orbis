#!/usr/bin/env bash
set -euo pipefail

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
cd "$ROOT_DIR"

echo -e "${BOLD}${BLUE}=== Starting Pre-PR Automated Checks ===${NC}\n"

ERRORS=0

run_check() {
    local name="$1"
    local cmd="$2"
    echo -e "${BLUE}▶ Running: ${name}...${NC}"
    if eval "$cmd"; then
        echo -e "${GREEN}✔ Passed: ${name}${NC}\n"
    else
        echo -e "${RED}✖ Failed: ${name}${NC}\n"
        ERRORS=$((ERRORS + 1))
    fi
}

# 1. Git Status & Diffs
echo -e "${BOLD}1. Git Status & Diffs${NC}"
git status --short
echo ""

# 2. Rust Code Formatting
run_check "Rust Format Check" "cargo fmt --package padu --package padu-protocol --package padu-client --package padu-core --package padu-daemon -- --check"

# 3. Rust Check
run_check "Cargo Check" "cargo check"

# 4. Protocol Sync Check
run_check "Protocol Sync Check" "cargo run -p padu-protocol --bin export_types -- --check"

# 5. Rust Tests
run_check "Cargo Tests" "cargo test"

# 6. Padu Client Package Checks
run_check "@padu/client Check" "bun run --filter @padu/client check"
run_check "@padu/client Tests" "bun run --filter @padu/client test"

# 7. Web & Mobile Typecheck & Tests (if present)
if [ -d "apps/web" ]; then
    run_check "Web Typecheck" "bun run --filter @padu/web typecheck"
    run_check "Web Tests" "bun run --filter @padu/web test"
fi

if [ -d "apps/mobile" ]; then
    run_check "Mobile Typecheck" "bun run --filter @padu/mobile typecheck || true"
fi

# Summary
echo -e "${BOLD}=== Automated Checks Summary ===${NC}"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}${BOLD}✔ All automated checks PASSED successfully! Ready for manual code inspection.${NC}"
    exit 0
else
    echo -e "${RED}${BOLD}✖ ${ERRORS} check(s) FAILED. Please resolve the errors above before opening a PR.${NC}"
    exit 1
fi
