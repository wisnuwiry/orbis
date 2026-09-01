---
title: Getting started
description: Install Padu and orchestrate local AI coding agents from desktop, web, or terminal.
nav: Getting started
order: 1
category: Getting started
---

# Getting started

Padu is a high-performance, native desktop and web workspace for orchestrating local AI coding agents. Built in Rust with GPUI (the GPU-accelerated engine behind Zed), Padu runs directly on your machine, keeping all code, transcripts, checkpoints, and credentials 100% local.

## 1. Desktop App (Recommended)

Download the native release for macOS, Linux, or Windows from [padu.dev/download](https://padu.dev/download) or the [GitHub releases page](https://github.com/wisnusaputra/padu/releases).

The desktop app bundles its own lightweight daemon and starts it automatically on loopback (`127.0.0.1:4789`). No separate server install or cloud account is required.

## 2. CLI Daemon (Headless / Devboxes)

For remote devboxes, headless Linux servers, or developers who prefer the terminal, install the Padu CLI binary:

```bash
# Download and install prebuilt binary, or build with Cargo:
cargo install --path crates/padu-cli
```

Start the daemon in background or interactive mode:

```bash
# Start the local daemon on 127.0.0.1:4789
padu daemon start

# Check status and connected agents
padu daemon status
```

The daemon can also serve the bundled web client directly from `http://127.0.0.1:4789/`. See [Self-hosting the web UI](/docs/web-ui).

Configuration and local state live under `PADU_HOME` (defaults to `~/.padu`).

## 3. Prerequisites

Padu manages external agent CLIs; it does not bundle AI models itself. Before launching an agent in Padu, make sure you have installed and authenticated at least one supported agent CLI:

- **[Claude Code](/docs/claude-code):** `claude` (Anthropic CLI)
- **[OpenAI Codex](/docs/codex):** `codex` (OpenAI CLI)
- **[OpenCode](https://opencode.ai/):** `opencode`
- **[Pi Agent](https://pi.dev):** `pi`
- **Other ACP Agents:** Cursor, Gemini CLI, GitHub Copilot, Amp, Grok, Kimi, etc.

See [Supported providers](/docs/supported-providers) for the full list of supported agents.

## Next Steps

- [Workspaces](/docs/workspaces) — Understand Padu's workspace, session, and worktree model.
- [Git worktrees](/docs/worktrees) — Run concurrent agents in isolated branches with setup hooks.
- [CLI Reference](/docs/cli) — Manage agents, workspaces, scripts, and daemons from your terminal.
- [Connectivity](/docs/connectivity) — Connect remote web or mobile clients via LAN, Tailscale, or SSH.
- [Performance Architecture](/docs/performance) — Learn how GPUI delivers 120 FPS rendering with zero UI-thread blocking.
- [Configuration](/docs/configuration) — Configure `~/.padu/config.json`, ports, and logging.
