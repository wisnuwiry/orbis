// Example: Temporary Atomic Counters for Streaming Investigation
// Use this pattern when debugging frame drops, CPU spikes, or commit rates.
// NOTE: Wire temporarily during profiling; do not ship to production.

use std::sync::atomic::{AtomicU32, Ordering};
use std::time::Instant;

pub static WINDOW_FRAMES: AtomicU32 = AtomicU32::new(0);
pub static TRANSCRIPT_RENDERS: AtomicU32 = AtomicU32::new(0);
pub static PUMP_COMMITS: AtomicU32 = AtomicU32::new(0);

// In root view `render()`:
pub fn track_render_counters(cx: &mut gpui::ViewContext<crate::app::Padu>) {
    WINDOW_FRAMES.fetch_add(1, Ordering::Relaxed);

    // Flushed once per second to file on background executor:
    static LAST_FLUSH: std::sync::Mutex<Option<Instant>> = std::sync::Mutex::new(None);
    let mut last = LAST_FLUSH.lock().unwrap(); // safe: template counter mutex
    let now = Instant::now();

    if last.map_or(true, |t| now.duration_since(t).as_secs() >= 1) {
        *last = Some(now);
        let frames = WINDOW_FRAMES.swap(0, Ordering::Relaxed);
        let renders = TRANSCRIPT_RENDERS.swap(0, Ordering::Relaxed);
        let commits = PUMP_COMMITS.swap(0, Ordering::Relaxed);

        cx.background_executor().spawn(async move {
            eprintln!("[PERF] 1s slice -> frames: {}, transcript: {}, commits: {}", frames, renders, commits); // keep: perf logging template
        }).detach();
    }
}
