# Pre-PR Code Review Rubric

Systematic checklist for evaluating Padu code changes. Each section lists the
requirement, **what to look for in the diff**, and the grep or inspection
command that detects violations.

---

## 1. Performance & UI Thread Safety

> Padu's render loop rebuilds every visible element every frame. One blocking
> call in `render()` is a user-visible hitch.

### 1a. Zero Blocking I/O in Render

**Rule**: Nothing reached from `render()` or a row builder may perform I/O.

**Anti-patterns to grep**:
```bash
# Filesystem access
git diff origin/main...HEAD -- '*.rs' | grep -n '^\+' | grep -E '(std::fs::|File::open|read_to_string|metadata\(\)|canonicalize\(\))'

# Subprocess spawns
git diff origin/main...HEAD -- '*.rs' | grep -n '^\+' | grep -E '(Command::new|std::process::)'

# Blocking locks
git diff origin/main...HEAD -- '*.rs' | grep -n '^\+' | grep -E '(\.lock\(\)|\.read\(\)|\.write\(\))' | grep -v 'RwLock.*async'

# Synchronous network
git diff origin/main...HEAD -- '*.rs' | grep -n '^\+' | grep -E '(reqwest::blocking|TcpStream::connect)'
```

**Fix**: `cx.background_executor().spawn(...)` → store on entity → `cx.notify()`.
Render reads stored value; miss = "not known yet" with graceful fallback.

### 1b. Frame Trigger Discipline

| Call | When OK | When Blocker |
| :--- | :--- | :--- |
| `cx.notify(view)` | Stream pump per commit, pulse clock, user events | — |
| `window.refresh()` | Hover transitions, drags, theme | During streaming (bypasses pane cache) |
| `request_animation_frame` | 200ms panel slide only | Any repeating use during streaming — pins at 120 Hz |
| `with_animation(...).repeat()` | **Never** | Always — use pulse clock (`src/ui/motion.rs`) instead |

```bash
git diff origin/main...HEAD -- '*.rs' | grep -n '^\+' | grep -E '(request_animation_frame|window\.refresh|with_animation.*repeat)'
```

### 1c. Streaming Cadence

- **Stream commits**: ≤ ~8.3 Hz (120 ms `STREAM_FRAME_INTERVAL`). Every new
  streaming delta kind must set the flags routing the pump onto `StreamFrame`.
  Missing this flag makes the pump wake on every provider chunk (40+ fps).
- **Pulse ticks**: ≤ ~30 Hz via self-parking clock. Loaders on expensive
  surfaces (transcript pane) need a stride (`spin_slow`, `pulse_lease_slow`,
  `Pulse::every(2)` ≈ 15 Hz). Strides re-establish on every tick.

### 1d. Proportional Per-Frame Work

- Collections virtualized with `list()`.
- Per-commit invalidation scoped to `STREAM_REMEASURE_TAIL_ROWS`.
- Row builders do not rebuild whole-session state.
- Fingerprint caches hash at display granularity (not raw seconds/timestamps).
- Live reasoning renders a byte window of the tail, not the full trace.

### 1e. Pane Caching

The root `Padu` view re-renders on every frame. The sidebar, transcript, and
right panel are `PaduPane` islands using `Entity::cached`. A notify targeted
at one pane rebuilds only that island. During the 200 ms panel slide, the
observer skips fan-out; the sliding pane and transcript miss their caches
naturally while the unmoving island replays.

If the diff adds a new pane or changes pane observation, verify it follows this
pattern.

### 1f. Overlay Scrollbars

During streaming the bar sits in its constant-opacity hold (zero repaints).
Schedule one-shot wake for hold expiry, ride pulse clock through the 350 ms
fade only. Driving frames through the hold pins the pane at pulse rate.

---

## 2. Client Parity & Protocol Sync

### 2a. Desktop ↔ Web Parity

| Changed in | Must also update |
| :--- | :--- |
| `src/app/`, `src/ui/`, `src/input/` | `apps/web/src/components/`, `apps/web/src/lib/` |
| `apps/web/` only | `src/` (unless web-exclusive by design) |

Exceptions: native window chrome, local OS integrations, platform-exclusive
capabilities.

**Heuristic grep**:
```bash
# Rust UI changed, no web counterpart
git diff --name-only origin/main...HEAD | grep -E '^src/(app|ui|input)' && \
  ! git diff --name-only origin/main...HEAD | grep -qE '^apps/web/' && \
  echo "⚠ Parity warning"
```

### 2b. Wire Protocol

If `crates/padu-protocol/` has changes:
1. Run `bun run protocol:generate`
2. Verify `packages/padu-client/src/generated/` updated and committed
3. `bun run protocol:check` must exit 0

### 2c. Mobile Parity

If the change is user-facing and not desktop-exclusive, check `apps/mobile/`.

---

## 3. Accessibility

| Requirement | What to check | GPUI API |
| :--- | :--- | :--- |
| Keyboard operable | Every mouse-reachable control has focus | `track_focus`, `tab_index`, `tab_group`, `tab_stop` |
| Visible focus | Focus ring / highlight on tab | `focus_visible` treatment |
| Standard keys | Arrows, Home/End, Enter/Space, Escape | Key dispatch handlers |
| Reduce-motion | Decorative animation gated | `cx.reduce_motion()`, `App::reduce_motion` |
| No color-only meaning | Status paired with icon/text | Visual inspection |
| Both themes | Legible text, sufficient contrast | Light & Dark theme check |
| Hit area | Interactive targets large enough | Extend hit region if needed |
| Hover = Focus | Hover-revealed content keyboard-accessible | Focus handler mirrors hover |

---

## 4. Code Quality

### 4a. Error Handling

```bash
# Bare .unwrap() in non-test code
git diff origin/main...HEAD -- '*.rs' | grep -n '^\+' | grep '\.unwrap()' | grep -v 'test' | grep -v '// safe:'
```

Acceptable only in tests or with an explicit `// safe:` justification.

### 4b. Debug & Temporary Code

```bash
# Rust debug macros
git diff origin/main...HEAD -- '*.rs' | grep -n '^\+' | grep -E '(dbg!\(|println!\(|eprintln!\()'

# TS/TSX debug
git diff origin/main...HEAD -- '*.ts' '*.tsx' | grep -n '^\+' | grep -E '(console\.(log|debug|warn)\(|debugger;)'

# Commented-out code blocks (>3 consecutive commented lines)
git diff origin/main...HEAD -- '*.rs' | grep -n '^\+' | grep -E '^\+\s*//' | head -20
```

### 4c. Security

```bash
# Hardcoded secrets
git diff origin/main...HEAD | grep -niE '(api[_-]?key|secret[_-]?key|password|token|credential)\s*[:=]\s*["\x27]'

# Tracked sensitive files
git status --short | grep -iE '\.(env|pem|key|p12|pfx)$'
```

### 4d. Provider Invariants

- Event ordering for citations, reasoning, and tool events must match the real
  provider payload.
- Private provider control markers must never appear in transcript UI.

### 4e. Documentation

- Existing comments and docstrings preserved unless deliberately updated.
- Architectural decisions documented inline for non-obvious patterns.

---

## 5. Automated Verification Baseline

All of these must pass (the check script runs them automatically):

- [ ] `cargo fmt --package padu ... -- --check`
- [ ] `cargo check`
- [ ] `cargo test`
- [ ] `bun run protocol:check`
- [ ] `bun run --filter @padu/client check`
- [ ] `bun run --filter @padu/client test`
- [ ] `bun run --filter @padu/web typecheck` (if web changed)
- [ ] `bun run --filter @padu/web test` (if web changed)
- [ ] `bun run --filter @padu/mobile typecheck` (if mobile changed)
