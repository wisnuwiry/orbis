# Pre-PR Code Review Gate

## Mandatory Rule

Before opening a Pull Request, creating a PR branch for submission, or concluding a feature task for PR:
1. **Always conduct a Pre-PR Code Review**:
   - Activate and follow the `pre-pr-review` skill (`.agents/skills/pre-pr-review/SKILL.md`).
   - Run the automated test and check pipeline (`.agents/skills/pre-pr-review/scripts/run-checks.sh`).
   - Inspect all diffs against base branch (`main` / `origin/main`).
2. **Enforce Project Quality Standards**:
   - Verify UI thread safety (no blocking I/O, subprocesses, or network calls in GPUI `render` or row builders).
   - Ensure desktop (`src/`) and web client (`apps/web/`) parity.
   - Verify wire protocol sync (`bun run protocol:check`).
   - Confirm keyboard accessibility, `reduce_motion` support, and contrast.
   - Ensure zero unhandled panics (`.unwrap()`) and no leaked debug logs or secrets.
3. **Generate Review Summary**:
   - Present a clear review summary with automated check results and any findings (Blockers, Warnings, Suggestions) to the user before submitting the PR.
