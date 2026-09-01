---
title: Claude Code
description: Run Claude Code in Padu using your existing Claude plan and local CLI.
nav: Claude Code
order: 22
category: Providers
---

# Claude Code

Padu runs Claude Code through Anthropic's official `claude` CLI and the Claude Agent SDK.

## Does Claude Code cost extra in Padu?

No. Claude Code usage in Padu counts against your normal Anthropic Claude plan limits or API usage. Padu does not charge any additional fees.

## Getting started

Install and sign in to the Claude Code CLI on the machine running Padu:

```bash
# Install Claude Code CLI
npm install -g @anthropic-ai/claude-code

# Authenticate with your Anthropic account
claude
```

Padu automatically discovers the installed `claude` executable on your system `PATH` and uses your local authentication tokens when launching a Claude Code session.

If your authentication session expires, re-authenticate via `claude` in your terminal, then launch or resume sessions in Padu.

## Running Claude Code in Padu

- **Desktop GUI:** Select **Claude Code** from the provider picker when starting a new task or session.
- **Integrated Terminal:** Open a terminal in any workspace and run `claude` directly with full PTY support.

## See also

- [Supported providers](/docs/supported-providers) — List of all natively supported agent CLIs.
- [Configuration](/docs/configuration) — Configure binary overrides in `~/.padu/settings.json`.
- [Troubleshooting](/docs/troubleshooting) — Diagnosing `PATH` resolution for installed CLI agents.
