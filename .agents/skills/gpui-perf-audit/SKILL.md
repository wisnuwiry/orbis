---
name: gpui-perf-audit
description: >-
  Investigate, profile, and verify Padu's GPUI streaming rendering performance,
  cadence compliance (≤ 8.3 Hz commits, ≤ 30 Hz pulse ticks), pane caching,
  and UI thread safety to prevent frame drops and high CPU usage.
---

# GPUI Performance & Streaming Audit Skill

This skill provides the exact methodology, measurement tools, and invariant checks to keep Padu's sustained streaming CPU under ~10% across text and reasoning streams on 120 Hz displays.

---

## When to Use This Skill

- Investigating CPU spikes or frame stutter during streaming.
- Adding or modifying animation loops, loaders, or scrollbars.
- Refactoring `apps/desktop/src/app/runtime.rs`, `apps/desktop/src/ui/motion.rs`, or `apps/desktop/src/md/render.rs`.
- Changing how panes observe root state or embedding new cached views.
- Benchmarking performance before release.

---

## Diagnostic Checklist

Run through these checks in order:

### 1. UI Thread Blocking I/O
Ensure no synchronous I/O exists in `render()` or row builders:
```bash
git grep -n 'std::fs::' apps/desktop/src/
git grep -n 'Command::new' apps/desktop/src/
```
All heavy operations must use `cx.background_executor().spawn`.

---

### 2. Cadence Audit
Read [Cadence Invariants](./references/cadence-invariants.md):
- **Stream commits ≤ ~8.3 Hz** (120 ms `STREAM_FRAME_INTERVAL`).
- **Pulse ticks ≤ ~30 Hz** via shared clock (`apps/desktop/src/ui/motion.rs`).
- No `with_animation(...).repeat()` (pins at 120 Hz).
- Loaders on expensive surfaces must carry a stride (`spin_slow`, `Pulse::every(2)`).

---

### 3. Pane Caching & Observation
- Root `Padu` view renders every frame.
- Sidebar, transcript, and right panel are `PaduPane` islands with `Entity::cached`.
- Panes observe the root view; internal updates dirty ancestors directly.
- During 200 ms panel slide, observer skips fan-out.

---

### 4. Scrollbar Discipline
- Streaming surfaces sit in constant-opacity hold (zero repaints).
- Single one-shot wake for hold expiry; pulse clock for 350 ms fade only.

---

## Measurement Playbook

### Step 1: Poll CPU During Streaming
Execute:
```bash
.agents/skills/gpui-perf-audit/scripts/measure-stream-cpu.sh 15 "Padu Debug"
```
Average CPU during streaming should stay under ~12% on debug builds.

### Step 2: Stack Sampling
To find *what* is expensive in leaf functions:
```bash
sample $(pgrep -f "Padu Debug" | head -1) 5
```

### Step 3: Temporary Counter Decomposition
If notify frequency is suspect, temporarily wire the `AtomicU32` counters from [Counter Instrumentation](./examples/counter-instrumentation.rs) to log frames vs renders vs commits per second.

---

## References

- [Cadence Invariants & Rules](./references/cadence-invariants.md)
- [Atomic Counter Instrumentation Template](./examples/counter-instrumentation.rs)
- Full architectural report: [docs/performance.md](../../docs/performance.md)
