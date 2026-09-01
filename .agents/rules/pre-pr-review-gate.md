# Pre-PR Code Review Gate

## Mandatory Rule

Before opening, preparing, or concluding any work intended for a Pull Request:

1. **Activate the `pre-pr-review` skill** — read and follow
   `.agents/skills/pre-pr-review/SKILL.md`, or invoke the `pre-pr-reviewer`
   subagent to perform the review autonomously.

2. **Scope the review to changed files** — run
   `git diff --name-only origin/main...HEAD` first. Only the domains with
   actual changes need full checks; others can be skipped with a note.

3. **Run the automated check suite** —
   `.agents/skills/pre-pr-review/scripts/run-checks.sh` handles smart scoping,
   anti-pattern scans, formatting, compilation, tests, protocol sync, client
   and web checks, and a parity heuristic. All checks must pass (warnings are
   acceptable with justification).

4. **Audit the diff for project-critical invariants**:
   - **Performance**: Zero blocking I/O in `render()` or row builders; no
     `request_animation_frame` or `window.refresh()` during streaming; streaming
     cadence ≤ 8.3 Hz commits, ≤ 30 Hz pulse; proportional per-frame work.
   - **Parity**: Native desktop (`src/`) and web client (`apps/web/`) updated
     together for user-facing changes; wire protocol regenerated if types changed.
   - **Accessibility**: Keyboard operability, visible focus, reduce-motion
     compliance, no color-only meaning.
   - **Safety**: No bare `.unwrap()` in runtime paths, no debug macros, no
     leaked secrets or credentials.
   - **Provider invariants**: Event ordering preserved, no control markers exposed.

5. **Generate a structured review report** — present an executive summary with
   verdict (✅ READY / ⚠️ ACTION REQUIRED / 🔴 BLOCKED), automated check
   results table, categorized findings with file:line citations, and a
   ready-to-paste PR description following `CONTRIBUTING.md` standards.

6. **Do not open or declare a PR ready** until all blockers are resolved and the
   user has seen the review report.
