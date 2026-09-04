# Changelog

All notable changes to Padu. This file is the **source of truth for the release
notes shown in the in-app updater**: [`scripts/release.ts`](scripts/release.ts)
extracts the section whose heading matches the version being released
(`MARKETING_VERSION`) and publishes it next to the update, so Sparkle shows it in
the update prompt.

Format follows [Keep a Changelog](https://keepachangelog.com). Add a new
`## [<version>]` section at the top for each release, matching the version you
set in the Xcode project.

Write release notes for the final product users receive, not the development
history. When a feature is still unreleased, fold its fixes and refinements into
the original feature bullet instead of adding separate entries for them.

## [unreleased]

## 0.1.1 - 2026-09-04

- **Indonesian Language Support**: Added complete Indonesian (Bahasa Indonesia) localization to the desktop client, navigation, and settings, with automatic system locale detection.
- **Apple Developer ID Signing & Notarization**: Official macOS releases are now Developer ID-signed and Apple-notarized, eliminating Gatekeeper warnings.
- **Provider Driver Diagnostics**: Added `padu-provider-test` CLI harness for validating and debugging AI agent provider drivers.
- **Native Build Performance**: Integrated compiler cache optimizations (`sccache`) across native desktop packaging and build pipelines.

## 0.1.0 - 2026-09-03

### Highlights
Padu is a fast, GPU-accelerated native control plane for local coding agents. Built in Rust with GPUI, it keeps your projects, sessions, and transcripts local on your machine with seamless multi-platform support across macOS, Linux, and Windows.

### Key Features
- **Local Agent Integrations**: First-class support for multiple coding agent CLIs, including Claude Code, Codex CLI, Cursor CLI, Amp, OpenCode, Grok Build, Pi, Kimi Code, and Fx.
- **Native GPUI Desktop Client**: Sub-millisecond input response, smooth 120Hz scrolling, native macOS/Linux/Windows window styling, and customizable dark/light theme support.
- **Standalone Daemon & Browser Client**: Run headlessly with `padu-daemon` and access your workspace remotely or locally using the companion `@padu/web` client.
- **Multi-Host Profile Support**: Seamlessly configure and switch between local and remote daemons directly from the sidebar.
- **Multi-Session Workspace & Branching**: Manage concurrent coding sessions, track session checkpoints, inspect git diff reviews, and switch branches without leaving the app.
