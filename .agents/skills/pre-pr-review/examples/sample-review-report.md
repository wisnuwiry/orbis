# Example: Pre-PR Code Review Report

Below is a realistic example showing the full report structure including
scope detection, anti-pattern scan results, performance audit, and the
generated PR description.

---

```markdown
# 🔍 Pre-PR Code Review Report

**Date:** 2026-08-20  
**Branch:** `feature/reasoning-veil-stride`  
**Base:** `origin/main`  
**Reviewer:** pre-pr-reviewer agent  
**Verdict:** ⚠️ ACTION REQUIRED  

---

## 1. Scope

| Domain | Files | Status |
| :--- | :---: | :--- |
| Rust native | 4 | ✅ Changed |
| Wire protocol | 0 | — |
| Client package | 0 | — |
| Web client | 2 | ✅ Changed |
| Mobile client | 0 | — |

**Parity**: Both native and web surfaces updated. ✅

---

## 2. Automated Checks

| St | Check | Time |
| :---: | :--- | ---: |
| ✔ | Rust formatting | 2s |
| ✔ | Cargo check | 14s |
| ✔ | Cargo test (87 passed) | 23s |
| ✔ | Protocol sync | 1s |
| ✔ | @padu/client typecheck | 3s |
| ✔ | @padu/client tests (52 passed) | 4s |
| ✔ | Web typecheck | 5s |
| ✔ | Web tests (140 passed) | 2s |
| — | Mobile typecheck | skipped |

**Total: 54s • 0 errors • 1 warning**

---

## 3. Anti-Pattern Scan

| Scan | Result |
| :--- | :--- |
| Debug macros (Rust) | ✔ Clean |
| Debug code (TS) | ✔ Clean |
| Bare `.unwrap()` | ⚠ 1 finding |
| Secrets / credentials | ✔ Clean |
| `request_animation_frame` | ✔ Clean |
| `window.refresh()` | ✔ Clean |
| Temp/OS files | ✔ Clean |

**Unwrap finding:**
- [`src/ui/motion.rs:247`](file:///path/to/src/ui/motion.rs#L247): New
  `.unwrap()` on `lease.stride()` — the stride is always `Some` here because
  it's set two lines above, but a `.unwrap_or(1)` is safer and documents the
  intent.

---

## 4. Detailed Findings

### 🔴 Blockers (0)

*None.*

### 🟡 Warnings (2)

1. **[`src/ui/motion.rs:247`](file:///path/to/src/ui/motion.rs#L247)** —
   Bare `.unwrap()` on stride value. Replace with `.unwrap_or(1)` to document
   the invariant and prevent a panic if the initialization order changes.

2. **[`src/ui/motion.rs:312`](file:///path/to/src/ui/motion.rs#L312)** —
   The reasoning veil's stride is set to `Pulse::every(2)` (~15 Hz) which is
   correct for the transcript pane, but the variable name `fast_stride`
   is misleading. Consider renaming to `reasoning_stride` or `strided_pulse`.

### 🟢 Suggestions (1)

1. **[`apps/web/src/lib/transcript-presentation.ts:89`](file:///path/to/apps/web/src/lib/transcript-presentation.ts#L89)** —
   The ternary could be simplified with nullish coalescing:
   ```ts
   // Before
   const stride = opts.stride !== undefined ? opts.stride : 2;
   // After
   const stride = opts.stride ?? 2;
   ```

---

## 5. Performance Audit

| Check | Verdict |
| :--- | :--- |
| Blocking I/O in render | ✅ None found |
| Frame trigger discipline | ✅ No new `request_animation_frame` or `window.refresh()` |
| Streaming cadence | ✅ Reasoning veil uses pulse clock with stride, not `with_animation().repeat()` |
| Proportional per-frame work | ✅ No new unbounded iteration |
| Pane caching | ✅ Veil leases `window.current_view()`, rebuilds only host island |

---

## 6. Accessibility Audit

| Check | Verdict |
| :--- | :--- |
| Keyboard operability | ➖ N/A (no new interactive elements) |
| Reduce-motion | ✅ Veil dissolve skipped when `cx.reduce_motion()` |
| Color-only meaning | ➖ N/A |

---

## 7. Generated PR Description

## Summary

Adds a pulse-clock stride to the reasoning veil dissolve so it ticks at ~15 Hz
instead of the default 30 Hz while mounted on the transcript pane, reducing
streaming CPU by ~3% in debug builds during fast-thinking providers.

## Changes

### Native Desktop (`src/`)
- `src/ui/motion.rs`: Added `reasoning_stride` constant; veil lease uses
  `Pulse::every(2)`.
- `src/app/transcript_view.rs`: Pass stride to veil construction.

### Web Client (`apps/web/`)
- `apps/web/src/lib/transcript-presentation.ts`: Stride parameter for veil
  animation timing.
- `apps/web/src/lib/transcript-presentation.test.ts`: Test for stride
  behavior.

## Checks

| Check | Status |
| :--- | :--- |
| `cargo fmt --check` | ✅ |
| `cargo check` | ✅ |
| `cargo test` | ✅ |
| `bun run protocol:check` | ✅ |
| `@padu/client check & test` | ✅ |
| `@padu/web typecheck & test` | ✅ |
| Manual validation in debug app | ✅ |

## Performance

- [x] Zero blocking I/O in `render()`
- [x] No `request_animation_frame` during streaming
- [x] Streaming cadence preserved (veil uses strided pulse clock)

## Parity

- [x] Desktop and web updated together

## Limitations & Follow-ups

- Counter-based measurement confirms ~3% reduction in debug; release build
  measurement pending.

---

## 8. Next Steps

1. Replace the bare `.unwrap()` at `src/ui/motion.rs:247` with `.unwrap_or(1)`.
2. Consider renaming `fast_stride` → `reasoning_stride`.
3. After fixes, re-run check suite and open PR.
```
