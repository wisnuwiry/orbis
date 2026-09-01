# Pre-PR Code Review Rubric & Standards

Use this rubric to systematically evaluate every code change before submitting a Pull Request.

---

## 1. Architectural & UI Thread Performance (Crucial)

Padu is a high-performance native desktop application with a web companion. Rendering and frame rates are paramount.

- [ ] **No Blocking I/O on UI Thread**:
  - `render()` and row builders must NEVER execute synchronous filesystem reads, git subprocess spawns, network calls, heavy synchronous computations, or acquire blocking locks.
  - Work must be moved to `cx.background_executor().spawn`, stored on the entity, followed by `cx.notify()`.
  - Rendering must gracefully handle "not ready yet" state without stutter.
- [ ] **Proportional Per-Frame Work**:
  - Large transcripts and collections must be virtualized using `list()`.
  - Row builders must avoid rebuilding whole-session state; hoist calculations to frame-cached structures.
- [ ] **Streaming Cadence Compliance**:
  - Respect stream commit cadences (≤ ~8.3 Hz) and pulse-clock ticks (≤ ~30 Hz).
  - Verify changes against `docs/performance.md`.

---

## 2. Parity & Protocol Synchronization

- [ ] **Desktop & Web Parity**:
  - Changes made to UI/UX, agent features, or workflows in `src/` (GPUI) must have corresponding updates in `apps/web/` (and `apps/mobile/` if applicable).
- [ ] **Wire Protocol Sync**:
  - If `crates/padu-protocol` has modified types, ensure `bun run protocol:generate` was executed and generated files under `packages/padu-client/src/generated` are committed.
  - `bun run protocol:check` must pass with zero diffs.

---

## 3. Accessibility (A11y) & UX

- [ ] **Keyboard Navigation**:
  - Every clickable or interactive element must support keyboard focus (`track_focus`, `tab_index`, `tab_group`, `tab_stop`).
  - Clear visual indicator on `focus_visible`.
  - Standard key bindings (Enter/Space, Arrow navigation, Escape to close).
- [ ] **Motion & Sensory Adaptability**:
  - Animations must respect `cx.reduce_motion()` or `App::reduce_motion`.
  - Color must not be the sole indicator of status (always pair with text or icon).
  - High contrast and readability in both Dark and Light themes.
  - Generous hit target area for click targets.

---

## 4. Code Quality & Rust / TypeScript Idioms

- [ ] **Error Handling**:
  - Avoid raw `.unwrap()` or `.expect()` in production code where failures can happen at runtime.
  - Use proper error propagation (`?`, custom error types, `Result`, `Option`).
- [ ] **Provider Invariants**:
  - Preserve exact event ordering for provider-native events (citations, reasoning, tool events).
  - Never expose private provider control markers in transcripts.
- [ ] **Cleanliness & Hygiene**:
  - No leftover `console.log`, `println!`, `dbg!`, or temporary debug code.
  - No unneeded commented-out code blocks.
  - No unintended temporary files (`.DS_Store`, `.env`, build dumps).
- [ ] **Documentation**:
  - Existing comments and docstrings preserved unless deliberately updated.
  - Complex logic or architectural patterns documented.

---

## 5. Automated Verification Baseline

- [ ] `cargo fmt --package padu --package padu-protocol --package padu-client --package padu-core --package padu-daemon -- --check`
- [ ] `cargo check`
- [ ] `cargo test`
- [ ] `bun run protocol:check`
- [ ] `bun run --filter @padu/client check`
- [ ] `bun run --filter @padu/client test`
- [ ] `bun run web:typecheck` & `bun run web:test` (if web files touched)
