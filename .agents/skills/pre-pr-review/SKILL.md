---
name: pre-pr-review
description: >-
  Comprehensive runbook and automated checklist for conducting a thorough code review
  before opening a Pull Request. Use this skill whenever the user asks to review changes
  before a PR, prepare a PR, audit branch diffs, verify code quality, check tests and
  formatting, or ensure client parity, accessibility, and UI performance.
---

# Pre-PR Code Review Skill

This skill provides a systematic process to inspect, verify, and review code changes before submitting a Pull Request (PR). It guarantees that code adheres to project standards, runs all test and check suites, prevents performance regressions on the UI thread, maintains desktop/web parity, and adheres to accessibility standards.

---

## Review Workflow Steps

Follow these sequential steps when conducting a Pre-PR Code Review:

### Step 1: Inspect Changes & Git Diff
1. Check working directory status and uncommitted changes:
   ```bash
   git status
   ```
2. Inspect the diff against the target branch (e.g. `main` or `origin/main`):
   ```bash
   git diff --stat origin/main...HEAD
   git diff origin/main...HEAD
   ```
3. Look out for:
   - Untracked or leftover files (e.g., `.DS_Store`, `.env`, temp files).
   - Leftover debug code (`println!`, `dbg!`, `console.log`, `debugger`).
   - Unintended edits or dead code.

---

### Step 2: Run Automated Checks & Tests
Execute the automated check runner:
```bash
.agents/skills/pre-pr-review/scripts/run-checks.sh
```

Or execute the individual check suite manually:
- **Rust formatting:**
  ```bash
  cargo fmt --package padu --package padu-protocol --package padu-client --package padu-core --package padu-daemon -- --check
  ```
- **Cargo check & tests:**
  ```bash
  cargo check
  cargo test
  ```
- **Protocol verification:**
  ```bash
  bun run protocol:check
  ```
  *(If wire types changed, run `bun run protocol:generate` and ensure updated files are committed)*
- **Padu Client suite:**
  ```bash
  bun run --filter @padu/client check
  bun run --filter @padu/client test
  ```
- **Web client tests (if applicable):**
  ```bash
  bun run --filter @padu/web typecheck
  bun run --filter @padu/web test
  ```

---

### Step 3: Domain & Architectural Review (Code Inspection)
Evaluate the diff against the [Review Rubric](./references/review-rubric.md):

1. **Performance & UI Thread Safety**:
   - Are any filesystem reads, subprocess spawns, network requests, or heavy computations called inside `render()` or row builders?
   - Is background work properly delegated to `cx.background_executor().spawn` with entity notifications?
   - Are long lists virtualized with `list()`?
2. **Client Synchronization & Parity**:
   - Are changes in `src/` reflected in `apps/web/` (and vice-versa)?
3. **Accessibility**:
   - Are interactive elements keyboard operable (`track_focus`, `tab_index`, `focus_visible`)?
   - Does animation respect `reduce_motion`?
   - Is color paired with text/icons for meaning?
4. **Safety & Robustness**:
   - Are error cases safely handled without panicking (`unwrap()` / `expect()`)?
   - Are provider-native event orderings preserved without exposing internal markers?

---

### Step 4: Generate Pre-PR Review Report
Synthesize your findings into a clear, structured report for the user:
- Executive Summary & PR readiness decision (✅ READY FOR PR or ⚠️ ACTION REQUIRED).
- Automated check results table.
- Categorized findings (🔴 Blockers, 🟡 Warnings, 🟢 Suggestions).
- PR description draft ready to be copied into GitHub (see [PR Template](./references/pr-template.md)).
- Reference [Sample Report](./examples/sample-review-report.md) for standard layout.

---

## Subagent Delegation

When conducting a comprehensive review, you can invoke the dedicated subagent:
```json
{
  "TypeName": "pre-pr-reviewer",
  "Role": "Pre-PR Code Reviewer",
  "Prompt": "Perform a comprehensive pre-PR code review on current branch diffs against main, run all checks, and generate the review report."
}
```
