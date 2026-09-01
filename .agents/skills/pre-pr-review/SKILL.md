---
name: pre-pr-review
description: >-
  Comprehensive runbook and automated checklist for conducting a thorough code
  review before opening a Pull Request. Use this skill whenever the user asks to
  review changes before a PR, prepare a PR, audit branch diffs, verify code
  quality, check tests and formatting, or ensure client parity, accessibility,
  and UI performance.
---

# Pre-PR Code Review Skill

Systematic, diff-scoped code review process that ensures every change meets
Padu's quality bar before it becomes a Pull Request. The review covers
automated verification, performance safety, client parity, accessibility,
security, and produces a structured report with a ready-to-paste PR description.

---

## Step 0 — Determine Scope

Before reviewing anything, establish *what changed* so every subsequent step
focuses on the affected surface area:

```bash
git diff --name-only origin/main...HEAD
```

Classify the changed files into domains:

| Domain | Paths | Activates |
| :--- | :--- | :--- |
| **Rust native** | `apps/desktop/`, `crates/`, `Cargo.*`, `build.rs` | Rust format, check, test, performance audit |
| **Wire protocol** | `crates/padu-protocol/` | Protocol sync, client package checks |
| **Client package** | `packages/padu-client/` | Client typecheck & tests |
| **Web client** | `apps/web/` | Web typecheck & tests |
| **Mobile client** | `apps/mobile/` | Mobile typecheck |

When a change touches `apps/desktop/src/` UI files (`app/`, `ui/`, `input/`, `browser/`,
`terminal/`) but not `apps/web/`, flag a **parity warning**. The converse is
also a warning.

---

## Step 1 — Run Automated Checks

Execute the smart-scoped check runner:

```bash
.agents/skills/pre-pr-review/scripts/run-checks.sh
```

Options:
- `--base <ref>` — compare against a different base (default: `origin/main`)
- `--full` — run every check regardless of changed files

The script handles:
1. **Git hygiene** — uncommitted files, `.DS_Store`, `.env`, `.orig`
2. **Anti-pattern scans** — `dbg!`, `println!`, `console.log`, `debugger`,
   bare `.unwrap()`, potential secrets, `request_animation_frame` /
   `window.refresh()` usage in diff
3. **Rust** — `cargo fmt --check`, `cargo check`, `cargo test`
4. **Protocol sync** — `bun run protocol:check`
5. **Client package** — `bun run --filter @padu/client check` & `test`
6. **Web client** — `bun run --filter @padu/web typecheck` & `test`
7. **Mobile client** — `bun run --filter @padu/mobile typecheck`
8. **Parity heuristic** — warns when only one surface was touched

If the script is unavailable, run each suite individually per
[CONTRIBUTING.md](../../CONTRIBUTING.md#checks).

---

## Step 2 — Performance & UI Thread Safety Audit

Read [docs/performance.md](../../docs/performance.md) for the full model. For
each changed Rust file in the diff, verify:

### 2a. Zero Blocking I/O on UI Thread

`render()`, row builders, and measurement callbacks run on the UI thread for
every visible element on every frame. Any of the following reached from render
is a **blocker**:

- Filesystem reads or writes (`std::fs::*`, `Path::metadata()`)
- Subprocess spawns (`Command::new`, `std::process`)
- Network requests (`reqwest`, TCP, HTTP)
- Blocking mutex/lock acquisition (`Mutex::lock`, `RwLock::read`)
- Synchronous IPC
- Heavy computation (parsing full transcripts, walking directory trees)

**Fix pattern**: `cx.background_executor().spawn(...)`, store result on the
entity, `cx.notify()`. Render reads the stored value; a miss means "not
known yet" and degrades gracefully (e.g. show a placeholder).

### 2b. Frame Trigger Discipline

| Trigger | Cost | Allowed? |
| :--- | :--- | :--- |
| `cx.notify(view)` | Re-renders view + ancestors; cached siblings replay | ✅ Stream pump per commit, pulse clock, user events |
| `window.refresh()` | Re-renders *everything*, bypasses pane cache | ⚠️ Only for genuine whole-window invalidation (hover transitions, drags, theme changes) |
| `request_animation_frame` | Display-rate (120 Hz) for as long as re-armed | 🔴 Never during streaming. Only the 200ms panel slide, gated by `panels_sliding()` |

If the diff introduces or modifies any of these triggers, verify it cannot
fire during a streaming turn.

### 2c. Streaming Cadence Compliance

Two cadences govern streaming CPU:

- **Stream commits ≤ ~8.3 Hz** (120 ms `STREAM_FRAME_INTERVAL`): Provider
  chunks queue and fold into one drain → one notify → one tail remeasure. A
  new delta kind must set the flags that route the pump onto `StreamFrame`.
- **Pulse ticks ≤ ~30 Hz**: All repeating animation rides the shared
  self-parking clock (`src/ui/motion.rs`). Never use
  `with_animation(...).repeat()` — it pins at 120 Hz. Loaders on expensive
  surfaces must use a stride (`spin_slow`, `pulse_lease_slow`).

### 2d. Proportional Per-Frame Work

- Long collections must be virtualized with `list()`.
- Per-commit invalidation must scope to `STREAM_REMEASURE_TAIL_ROWS`.
- Row builders must not rebuild whole-session state; hoist to a cache refreshed
  once per frame.
- Fingerprint caches must hash at display granularity (not raw timestamps).

### 2e. Overlay Scrollbars

If the diff touches scrollbars: during streaming the bar sits in its constant-
opacity reveal hold (zero repaints needed). Only schedule a one-shot wake for
hold expiry and ride the pulse clock through the 350 ms fade. Driving frames
through the hold pins the pane at pulse rate.

---

## Step 3 — Client Parity Audit

For every user-facing change in the diff:

1. **Desktop (`apps/desktop/`) ↔ Web (`apps/web/`)**: Both must receive the same
   feature, UI behavior, state representation, and controls — unless the
   capability is explicitly platform-exclusive (native window chrome, local OS
   integrations).
2. **Wire protocol**: If `crates/padu-protocol` types changed, verify
   `bun run protocol:generate` was run and generated files are committed.
3. **Mobile (`apps/mobile/`)**: If the change is user-facing and not
   desktop-exclusive, check mobile parity.
4. **Visual hierarchy and interaction models**: Must be consistent across
   surfaces, while respecting GPUI idioms in `apps/desktop/` and modern web patterns
   in `apps/web/`.

---

## Step 4 — Accessibility Audit

For every new or modified interactive element:

- [ ] **Keyboard operable**: `track_focus` with `tab_index`, `tab_group`,
      `tab_stop`. Standard keys: arrows, Home/End, Enter/Space, Escape.
- [ ] **Visible focus**: `focus_visible` treatment present.
- [ ] **Reduce-motion**: `with_animation` already respects `App::reduce_motion`.
      Direct `request_animation_frame` for decorative motion must check
      `cx.reduce_motion()` and skip.
- [ ] **No color-only meaning**: Status colors paired with icon or text.
- [ ] **Legibility**: Text readable against surface in both themes; interactive
      targets have enough hit area.
- [ ] **Hover ↔ Focus**: Anything revealed on hover also reachable by keyboard.

---

## Step 5 — Code Quality & Safety

### 5a. Error Handling
- No bare `.unwrap()` or `.expect()` in runtime-fallible code paths (only
  acceptable in tests or with a `// safe:` justification comment).
- Proper error propagation: `?`, `Result`, `Option`, custom error types.

### 5b. Provider Invariants
- Preserve exact event ordering for provider-native events (citations,
  reasoning, tool events).
- Never expose private provider control markers in the transcript UI.

### 5c. Diff Hygiene
Grep the diff for:
```bash
# Debug code
git diff origin/main...HEAD -- '*.rs' | grep -n '^\+' | grep -E '(dbg!\(|println!\()'
git diff origin/main...HEAD -- '*.ts' '*.tsx' | grep -n '^\+' | grep -E 'console\.(log|debug)\('

# Secrets
git diff origin/main...HEAD | grep -niE '(api[_-]?key|secret|password|token)\s*[:=]\s*["\x27]'

# Leftover files
git status --short | grep -E '\.(DS_Store|env|orig|bak)$'
```

### 5d. Documentation
- Existing comments and docstrings preserved unless deliberately updated.
- Complex architectural decisions documented inline.

---

## Step 6 — Generate Review Report

Synthesize findings into a structured artifact:

1. **Executive Summary** — verdict (✅ READY / ⚠️ ACTION REQUIRED / 🔴 BLOCKED)
   with one-sentence rationale.
2. **Scope** — which domains were touched, how many files.
3. **Automated Checks Table** — status, name, elapsed time for each check.
4. **Anti-Pattern Scan Results** — any debug code, unwraps, secrets found.
5. **Categorized Findings**:
   - 🔴 **Blockers** — must fix (e.g. blocking I/O in render, failing tests)
   - 🟡 **Warnings** — should fix (e.g. parity gap, missing a11y, bare unwrap)
   - 🟢 **Suggestions** — nice to have (style, naming, optional simplification)
   
   Each finding must cite the file path and line number.
6. **PR Description** — ready to paste into GitHub, following the template in
   [references/pr-template.md](./references/pr-template.md).

Reference [examples/sample-review-report.md](./examples/sample-review-report.md)
for the standard layout.

---

## Subagent Usage

For comprehensive reviews, invoke the dedicated `pre-pr-reviewer` subagent:

```
TypeName: pre-pr-reviewer
Role:     Pre-PR Code Reviewer
Prompt:   Perform a pre-PR code review on the current branch against origin/main.
          Run the automated check suite, audit diffs for performance, parity,
          a11y, and security, then generate the review report artifact.
```

The subagent has write tools to execute the check script and create the report.
