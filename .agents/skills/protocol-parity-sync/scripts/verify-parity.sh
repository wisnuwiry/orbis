#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# Protocol & Cross-Client Parity Verification Script for Padu
#
# Verifies:
# 1. Rust wire protocol export check (`cargo run -p padu-protocol --bin export_types -- --check`)
# 2. Synchronized client packages and web/mobile typechecks
# 3. Heuristic parity check on changed files between desktop, web, and mobile
# ──────────────────────────────────────────────────────────────────────────────

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
cd "$ROOT_DIR"

BASE_REF="${1:-origin/main}"
ERRORS=0
WARNINGS=0

echo -e "${BOLD}${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${BLUE}║   Padu Protocol & Parity Verification        ║${NC}"
echo -e "${BOLD}${BLUE}╚══════════════════════════════════════════════╝${NC}\n"

echo -e "${BOLD}Comparing against base:${NC} ${BASE_REF}\n"

# 1. Check Protocol Export Types
echo -e "${BLUE}▶ 1. Checking wire protocol synchronization...${NC}"
if cargo run -p padu-protocol --bin export_types -- --check > /dev/null 2>&1; then
    echo -e "${GREEN}  ✔ Wire protocol types in packages/padu-client/src/generated are in sync.${NC}\n"
else
    echo -e "${RED}  ✖ Wire protocol types are OUT OF SYNC!${NC}"
    echo -e "    Run ${BOLD}bun run protocol:generate${NC} and commit the generated files.\n"
    ERRORS=$((ERRORS + 1))
fi

# 2. Padu Client Package
echo -e "${BLUE}▶ 2. Checking @padu/client package...${NC}"
if bun run --filter @padu/client check > /dev/null 2>&1; then
    echo -e "${GREEN}  ✔ @padu/client typecheck passed.${NC}"
else
    echo -e "${RED}  ✖ @padu/client typecheck failed!${NC}"
    ERRORS=$((ERRORS + 1))
fi

if bun run --filter @padu/client test > /dev/null 2>&1; then
    echo -e "${GREEN}  ✔ @padu/client test suite passed.${NC}\n"
else
    echo -e "${RED}  ✖ @padu/client test suite failed!${NC}\n"
    ERRORS=$((ERRORS + 1))
fi

# 3. Web Client Typecheck & Test
if [ -d "apps/web" ]; then
    echo -e "${BLUE}▶ 3. Checking @padu/web client...${NC}"
    if bun run --filter @padu/web typecheck > /dev/null 2>&1; then
        echo -e "${GREEN}  ✔ Web client typecheck passed.${NC}"
    else
        echo -e "${RED}  ✖ Web client typecheck failed!${NC}"
        ERRORS=$((ERRORS + 1))
    fi

    if bun run --filter @padu/web test > /dev/null 2>&1; then
        echo -e "${GREEN}  ✔ Web client test suite passed.${NC}\n"
    else
        echo -e "${RED}  ✖ Web client test suite failed!${NC}\n"
        ERRORS=$((ERRORS + 1))
    fi
fi

# 4. Mobile Client Typecheck & Test
if [ -d "apps/mobile" ]; then
    echo -e "${BLUE}▶ 4. Checking @padu/mobile client...${NC}"
    if bun run --filter @padu/mobile typecheck > /dev/null 2>&1; then
        echo -e "${GREEN}  ✔ Mobile client typecheck passed.${NC}\n"
    else
        echo -e "${RED}  ✖ Mobile client typecheck failed!${NC}\n"
        ERRORS=$((ERRORS + 1))
    fi
fi

# 5. Parity Diff Heuristics
echo -e "${BLUE}▶ 5. Inspecting changed files for cross-client parity...${NC}"
CHANGED_FILES=$(git diff --name-only "${BASE_REF}"...HEAD 2>/dev/null || git diff --name-only HEAD)

RUST_UI=$(echo "$CHANGED_FILES" | grep -E '^apps/desktop/src/(app|ui|input|browser|terminal)' || true)
WEB_UI=$(echo "$CHANGED_FILES" | grep -E '^apps/web/src/(components|routes|lib)' || true)
MOBILE_UI=$(echo "$CHANGED_FILES" | grep -E '^apps/mobile/src/' || true)

if [ -n "$RUST_UI" ] && [ -z "$WEB_UI" ]; then
    echo -e "${YELLOW}  ⚠ WARNING: Desktop UI changes detected with NO corresponding web changes:${NC}"
    echo "$RUST_UI" | sed 's/^/    /'
    echo -e "    Please confirm if web client parity is required for this feature.\n"
    WARNINGS=$((WARNINGS + 1))
elif [ -n "$WEB_UI" ] && [ -z "$RUST_UI" ]; then
    echo -e "${YELLOW}  ⚠ WARNING: Web UI changes detected with NO corresponding desktop changes:${NC}"
    echo "$WEB_UI" | sed 's/^/    /'
    echo -e "    Please confirm if desktop client parity is required for this feature.\n"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}  ✔ UI changes are balanced across surfaces or non-UI scoped.${NC}\n"
fi

# Summary
echo -e "${BOLD}=== Parity Verification Summary ===${NC}"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}${BOLD}✔ All protocol and parity checks PASSED!${NC}\n"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}${BOLD}⚠ Passed with ${WARNINGS} parity warning(s). Please verify.${NC}\n"
    exit 0
else
    echo -e "${RED}${BOLD}✖ ${ERRORS} check(s) FAILED. Please resolve the errors above.${NC}\n"
    exit 1
fi
