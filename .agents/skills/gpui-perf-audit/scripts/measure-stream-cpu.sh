#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# Streaming CPU & Process Profiler for Padu
#
# Usage:
#   .agents/skills/gpui-perf-audit/scripts/measure-stream-cpu.sh [duration_seconds] [process_name]
#
# Default duration: 15 seconds
# Default process: "Padu Debug" (or "padu")
# ──────────────────────────────────────────────────────────────────────────────

DURATION="${1:-15}"
PROC_NAME="${2:-Padu Debug}"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

echo -e "${BOLD}${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${BLUE}║   Padu Streaming CPU Profiler                ║${NC}"
echo -e "${BOLD}${BLUE}╚══════════════════════════════════════════════╝${NC}\n"

PID=$(pgrep -f "$PROC_NAME" | head -1 || true)

if [ -z "$PID" ]; then
    echo -e "${RED}✖ Process '$PROC_NAME' is not running!${NC}"
    echo "  Please start the app with 'bun run dev' before measuring."
    exit 1
fi

echo -e "${BOLD}Target Process:${NC} $PROC_NAME (PID: $PID)"
echo -e "${BOLD}Duration:${NC}       ${DURATION}s (polling every 500ms)\n"
echo -e "${DIM}Starting measurements... trigger streaming now.${NC}\n"

SAMPLES=0
SUM=0
MAX=0
MIN=999

END_TIME=$((SECONDS + DURATION))

printf "%-10s %-12s %s\n" "Elapsed" "CPU %" "Visual Bar"
printf "%-10s %-12s %s\n" "───────" "─────" "──────────"

while [ $SECONDS -lt $END_TIME ]; do
    CPU=$(ps -o %cpu= -p "$PID" 2>/dev/null | tr -d ' ' || echo "0.0")
    if [ -z "$CPU" ]; then
        break
    fi

    CPU_INT=$(printf "%.0f" "$CPU" 2>/dev/null || echo 0)
    SAMPLES=$((SAMPLES + 1))
    SUM=$(echo "$SUM + $CPU" | bc 2>/dev/null || echo "$SUM")

    if (( $(echo "$CPU > $MAX" | bc -l 2>/dev/null || echo 0) )); then
        MAX=$CPU
    fi
    if (( $(echo "$CPU < $MIN" | bc -l 2>/dev/null || echo 0) )); then
        MIN=$CPU
    fi

    # Visual Bar
    BAR_LEN=$((CPU_INT / 2))
    BAR=$(printf '%*s' "$BAR_LEN" '' | tr ' ' '█')

    if [ "$CPU_INT" -gt 25 ]; then
        COLOR="$RED"
    elif [ "$CPU_INT" -gt 15 ]; then
        COLOR="$YELLOW"
    else
        COLOR="$GREEN"
    fi

    printf "%-10s ${COLOR}%-12s${NC} ${COLOR}%s${NC}\n" "${SECONDS}s" "${CPU}%" "$BAR"
    sleep 0.5
done

if [ "$SAMPLES" -gt 0 ]; then
    AVG=$(echo "scale=2; $SUM / $SAMPLES" | bc 2>/dev/null || echo "0.0")
else
    AVG="0.0"
fi

echo -e "\n${BOLD}=== Streaming Profile Results ===${NC}"
echo -e "  ${BOLD}Samples taken:${NC} $SAMPLES"
echo -e "  ${BOLD}Average CPU:${NC}   ${AVG}%"
echo -e "  ${BOLD}Min CPU:${NC}       ${MIN}%"
echo -e "  ${BOLD}Max CPU:${NC}       ${MAX}%"
echo ""

# Evaluation against Padu performance benchmark (< 10% average during streaming)
AVG_INT=$(printf "%.0f" "$AVG" 2>/dev/null || echo 0)
if [ "$AVG_INT" -le 12 ]; then
    echo -e "${GREEN}${BOLD}✔ EXCELLENT:${NC} Average CPU is within target (< 12%)."
elif [ "$AVG_INT" -le 25 ]; then
    echo -e "${YELLOW}${BOLD}⚠ WARNING:${NC} Average CPU is elevated (${AVG}%). Check pulse clock strides and row caching."
else
    echo -e "${RED}${BOLD}✖ REGRESSION DETECTED:${NC} Average CPU is excessively high (${AVG}%)."
    echo "  Check for: unstrided pulse clock, request_animation_frame loop, missing StreamFrame flag, or blocking I/O in render."
fi
