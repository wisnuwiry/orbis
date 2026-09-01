# Streaming Cadence & Performance Invariants

Reference guide extracted from `docs/performance.md`. Every GPUI modification must preserve these rules.

---

## 1. Frame Triggers & Cost Model

**Model**: `CPU ≈ redraw rate × visible element count`

| Trigger | Cost | Usage Rules |
| :--- | :--- | :--- |
| `cx.notify(view)` | Re-renders target view + ancestors; cached sibling panes replay. | Allowed: Stream pump per commit, pulse clock, user event handlers. |
| `window.refresh()` | Re-renders whole window and **bypasses every cached pane**. | Allowed only for whole-window invalidations (hover transitions, drags, theme switches). Never in streaming loops. |
| `request_animation_frame` | Display-rate (120 Hz) re-renders for current view for as long as it re-arms. | **Forbidden during streaming**. One repeating animation pins window at 120 Hz (~36% CPU). Only sanctioned transient: 200 ms panel slide. |

---

## 2. The Two Cadences

### A. Stream Commits: ≤ ~8.3 Hz
- Provider chunks buffer for `STREAM_FRAME_INTERVAL` (120 ms) and fold into one drain → one notify → one tail remeasure.
- **Trap**: Pump timer must NOT race wake channel.
- **Trap**: Every streaming delta kind must set flags that route pump onto `StreamFrame` schedule. Missing `markdown_changed` on reasoning deltas caused a 40+ commits/sec bug.

### B. Pulse Clock Ticks: ≤ ~30 Hz
- All repeating animation rides the shared self-parking clock in `src/ui/motion.rs`.
- Never use `with_animation(...).repeat()`.
- Expensive surfaces (transcript pane) require a stride (`spin_slow`, `pulse_lease_slow`, `Pulse::every(2)` ≈ 15 Hz).
- Strides re-establish on every tick.

---

## 3. Pane Caching Rules

- The root `Padu` view re-renders on every frame.
- Sidebar, transcript, and right panel are `PaduPane` islands embedded with `Entity::cached`.
- Panes observe the root; updates born inside an island dirty the ancestor pane directly.
- During 200ms panel slide (`panels_sliding()`), observer skips fan-out: sliding panel and transcript rebuild while static island replays.

---

## 4. Overlay Scrollbar Rules

- During streaming, scrollbar sits in its reveal hold at constant opacity (zero repaints required).
- Schedule a single one-shot wake for hold expiry; ride pulse clock only through the 350 ms fade.
- Driving frames through the hold pins the pane at pulse rate.

---

## 5. Bounding Visible Elements

- Virtualize transcript using `list()`.
- Remeasure only `STREAM_REMEASURE_TAIL_ROWS` per commit.
- Live reasoning renders a byte window (`live_reasoning_window_start`), not full markdown trace.
- Cache fingerprint hashes at display granularity (not raw seconds/timestamps).
