# Changelog

All notable changes to Orbis. This file is the **source of truth for the release
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

## 0.1.0

- Initial release of Orbis: a fast, native control plane for local coding agents
- Support for multiple local agent CLIs (Claude Code, Codex CLI, Cursor CLI, Amp, OpenCode, Grok Build, Pi, Kimi Code, Fx)
- GPU-accelerated desktop interface built with GPUI
- Standalone headless daemon and web client
- Multi-session workspace, checkpoints, branching, and context diff review
- Conversation steering, follow-up queueing, and slash commands
