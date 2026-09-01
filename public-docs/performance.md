---
title: Performance Architecture
description: Native GPUI GPU rendering, zero UI-thread blocking, stream cadences, and memory virtualization in Padu.
nav: Performance
order: 12
category: Architecture
---

# Performance Architecture

Padu is engineered from the ground up in Rust using **GPUI**—the GPU-accelerated UI framework developed by Zed Industries. Unlike web-wrapped desktop clients (Electron/CEF), Padu renders directly to GPU hardware at native refresh rates (120 Hz+) with minimal CPU and memory overhead.

## 1. Direct GPU Rendering (No DOM / Webview Overhead)

- **Native Graphics Backends:** GPUI issues direct draw calls to **Apple Metal** on macOS, **Vulkan / X11 / Wayland** on Linux, and **DirectX 12** on Windows.
- **Zero Layout Reflows:** There is no HTML/CSS DOM parsing or JavaScript garbage collection loop on the rendering thread. Layout measurements and text shaping are computed in compiled Rust.
- **Sub-Millisecond Frame Times:** Typical frame rendering times stay under 2.0ms, well within the 8.3ms budget for 120 FPS high-refresh displays.

## 2. Zero UI-Thread Blocking

Padu enforces a strict concurrency rule: **the UI rendering thread never performs blocking operations**.
- **No Synchronous I/O:** File reads, directory traversals, Git commands, network calls, and socket operations are executed strictly on background thread pools (`cx.background_executor()`).
- **Graceful Async Degradation:** Rendering reads only from in-memory cached state. When a background operation is in progress, the UI renders immediate placeholder states and updates smoothly via reactive notifications (`cx.notify()`).

## 3. Streaming Cadence Regulation

Streaming massive volumes of LLM tokens and tool outputs can overwhelm standard GUI event loops. Padu regulates stream processing using a dual-cadence model:
- **Stream Commits (≤ 8.3 Hz):** Incoming token chunks from the daemon are batched and committed to the transcript model at controlled intervals, preventing excessive state invalidations.
- **Pulse Clock (≤ 30 Hz):** Subtle animation pulses and streaming indicator spinners tick at a capped rate to maintain near-zero idle CPU usage during long agent turns.

## 4. Virtualized Transcripts & Lists

Agent transcripts often span hundreds of turns, extensive unified diffs, and thousands of tool execution lines:
- **Virtualized Lists:** Padu renders only the items currently visible within the viewport (with minimal overscan).
- **Measurement Caching:** Row heights and syntax-highlighted code blocks are cached to ensure instantaneous 120 FPS scrolling even with 100k+ tokens in a single session.

## 5. Pane Caching & Retained Textures

When switching between multiple workspaces, terminal tabs, and diff reviews:
- Inactive tabs retain texture and layout caches in memory.
- Switching between tabs is instantaneous (0ms redraw delay), eliminating visual flicker and state reconstruction costs.
