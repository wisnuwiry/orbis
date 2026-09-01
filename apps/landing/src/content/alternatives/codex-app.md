---
title: Open Source Codex App Alternative With Native Mobile and Multi-Provider Support
description: Padu is an open source Codex alternative that runs on your machines without a required Padu account, telemetry, or cloud service.
nav: Codex App
order: 54
---

# Padu vs Codex App

OpenAI provides Codex through the ChatGPT desktop app on macOS, Windows, and Linux, with local, worktree, cloud, and remote workflows.

Padu is an app for orchestrating coding agents, with native clients on desktop, mobile, web, and the CLI. Open source (Apache-2.0).

![Padu desktop and mobile app](/hero-mockup.png)

## The main difference

OpenAI provides Codex through the ChatGPT desktop and mobile apps. Using those product surfaces requires an OpenAI account, and cloud work runs on OpenAI-managed infrastructure.

Padu runs your installed Codex CLI on machines you control. It does not require a Padu account, collect telemetry, or depend on a Padu cloud service. Connect directly from desktop, mobile, web, or the CLI, or use the optional end-to-end encrypted relay.

Padu does not upload or store your code. The relay cannot read your code, messages, or agent output. You can self-host the daemon, web client, and relay, and use the same control plane with Codex, Claude Code, OpenCode, Pi, ACP agents, and custom providers.

## Architecture

Padu runs an independent daemon on your laptop, workstation, VM, home lab, or cloud machine. The daemon launches your installed Codex CLI with its existing credentials and configuration. Clients connect directly or through the optional end-to-end encrypted relay.

OpenAI provides local, worktree, remote, and cloud Codex workflows through its ChatGPT product surfaces. Local and remote work use a connected host, while cloud work runs on OpenAI-managed infrastructure.

## Providers

Codex App runs Codex.

Padu runs Codex too, plus Claude Code, OpenCode, and Pi natively, plus 30+ more agents through the in-app catalog including GitHub Copilot, Cursor, Gemini CLI, and Amp. Padu speaks the [Agent Client Protocol](https://agentclientprotocol.com), so any ACP agent works. Custom providers run any CLI agent. See [all supported providers](/agents).

## Application plugins

[Padu plugins](/docs/plugins) extend Padu itself. They can add server behavior and native client components such as workspace panels, sidebar items, composer attachments, themes, and Command Center items across desktop, browser, iOS, and Android.

Codex supports skills, MCP servers, and other agent extensions. OpenAI does not document an extension API for adding server-side behavior and native interface components to the Codex application itself.

## Desktop platforms

OpenAI's desktop app and Padu are available on macOS, Windows, and Linux.

## Mobile

Padu ships native iOS and Android apps with the same agent workflow as the desktop app.

ChatGPT Remote can start and continue Codex chats, approve actions, and review outputs from iOS and Android through a connected desktop host.

## Worktrees and local setup

Both tools support Git worktrees for parallel work.

Codex App creates Codex-managed worktrees under `$CODEX_HOME/worktrees` and supports local environment setup scripts and project actions through `.codex` configuration.

Padu creates worktrees under `$PADU_HOME/worktrees`, runs setup and teardown hooks from `config.toml`, and gives each worktree its own dev server URLs like `web.fix-auth.my-app.localhost` so parallel services don't fight for ports.

## GitHub and review

Both tools support reviewing diffs, committing, pushing, and opening pull requests from the app.

Padu also surfaces PR checks and reviews in the app, and exposes the same workflow through the CLI and MCP server.

## CLI and automation

Codex has its own CLI, IDE extension, web app, automations, and SDK.

Padu's CLI controls the same daemon as the app:

```bash
padu run --provider codex "implement OAuth"
padu run --provider claude --worktree refactor-auth "refactor auth"
padu run --host devbox:6767 "run the test suite"
padu ls
padu send <agent-id> "add tests"
padu schedule create --cron "0 9 * * 1" "audit the codebase"
```

`padu run --host` connects to a remote daemon. `padu schedule` runs an agent on a cron. The MCP server lets other agents create worktrees, launch agents, open terminals, and send prompts.

## Voice

Codex App supports voice dictation.

Padu supports dictation and realtime voice mode. Speech-to-text and text-to-speech can run locally on your device.

## Comparison

|                                 | Padu                                                           | Codex App                                            |
| ------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------- |
| License                         | Open source (Apache-2.0)                                        | Codex CLI is open source; application is proprietary |
| Desktop platforms               | macOS, Linux, Windows                                           | macOS, Linux, Windows                                |
| Mobile coding workflow          | Native Padu workspace on iOS and Android                       | ChatGPT Remote on iOS and Android                    |
| Providers                       | Codex, Claude Code, OpenCode, Pi + 30+ via ACP catalog + custom | Codex                                                |
| Product account required        | No                                                              | OpenAI account                                       |
| Required Padu cloud connection | No                                                              | Not applicable                                       |
| Git worktrees                   | Yes                                                             | Yes                                                  |
| Per-worktree dev server URLs    | Yes                                                             | No                                                   |
| In-app terminal                 | Yes                                                             | Yes                                                  |
| In-app browser                  | Yes                                                             | Yes                                                  |
| GitHub workflow in app          | Commit, push, PR, checks, reviews, merge                        | Commit, push, PR                                     |
| CLI                             | Run, `--host`, ls, send, schedule, loop                         | Codex CLI                                            |
| Remote transport                | Direct connection or end-to-end encrypted relay                 | OpenAI Remote                                        |
| Application plugins             | Server code and native client components                        | No                                                   |
| Voice                           | Dictation and realtime voice                                    | Dictation                                            |
| Self-hosted control plane       | Daemon, web client, and relay                                   | No                                                   |

See also: [Padu vs Claude Desktop](/alternatives/claude-desktop), [Padu vs OpenCode Desktop](/alternatives/opencode-desktop), [all supported providers](/agents).
