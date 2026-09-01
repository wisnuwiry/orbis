---
title: Performance Architecture
description: Native GPUI streaming performance, zero UI-thread blocking, and frame cadence in Padu.
nav: Performance
order: 14
category: Architecture
---

# Performance Architecture

Padu is designed as a high-performance native desktop client with sub-millisecond response times, 120Hz smooth scrolling, and optimized streaming cadences.

## Core Tenets

- **Zero UI-thread blocking**: Render loops never perform filesystem I/O, subprocess spawns, or synchronous IPC.
- **Cadence regulation**: Stream commits at ≤ 8.3 Hz and pulse-clock ticks at ≤ 30 Hz to ensure low CPU usage.
- **Virtualized rendering**: Chat timelines, diffs, and file trees are virtualized with efficient measurement caching.
- **Pane caching**: Background tabs retain texture caches to eliminate redraw cost during switching.
