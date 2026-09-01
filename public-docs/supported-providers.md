---
title: Supported providers
description: Every coding agent CLI Padu can launch and orchestrate, natively supported drivers and the ACP catalog.
nav: Supported providers
order: 21
category: Providers
---

# Supported providers

Padu communicates directly with locally installed agent CLIs via native process adapters in `crates/padu-core` and the open Agent Client Protocol (ACP).

For an architectural overview, see [Providers overview](/docs/providers). To configure binary path overrides or disable providers, see [Configuration](/docs/configuration).

## Native Drivers

These providers include first-class driver implementations with structured token streaming, checkpoint capture, and reasoning token demuxing:

- **[Claude Code](/docs/claude-code)** — Anthropic's official coding agent CLI with tool streaming and deep reasoning.
- **[OpenAI Codex](/docs/codex)** — OpenAI's workspace agent with sandbox execution and model switching.
- **[OpenCode](https://opencode.ai/)** — Open-source terminal assistant with multi-provider model routing.
- **[Pi Agent](https://pi.dev)** — Minimal, fast terminal coding agent with multi-provider support.
- **[Cursor CLI](https://cursor.com)** — Cursor's autonomous terminal coding companion.
- **[Amp](https://github.com/tao12345666333/amp-acp)** — Frontier coding agent with worktree capabilities.
- **[DeepSeek TUI](https://deepseek.com)** — High-reasoning open model assistant.
- **[Grok Build](https://docs.x.ai/build/overview)** — xAI's agentic coding CLI.
- **[Kimi Code](https://github.com/MoonshotAI/kimi-code)** — Moonshot AI's long-context assistant.

## ACP (Agent Client Protocol) Catalog

Any agent speaking the [Agent Client Protocol (ACP)](https://agentclientprotocol.com) over standard I/O streams (`stdio`) is supported out of the box:

- **Cline** — Autonomous coding agent with file and terminal tools.
- **Gemini CLI** — Google's official Gemini developer CLI.
- **GitHub Copilot CLI** — GitHub's AI pair programmer.
- **Goose** — Block's local open-source AI agent.
- **Mistral Vibe** — Mistral's open-source CLI assistant.
- **Hermes Agent** — Nous Research's autonomous agent.
- **Qwen Code** — Alibaba's Qwen coding assistant.
- **Augment / Auggie CLI** — Context engine-powered assistant.

View the full interactive catalog on [padu.dev/agents](/agents).
