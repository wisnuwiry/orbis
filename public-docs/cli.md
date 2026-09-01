---
title: CLI
description: "Padu CLI reference: manage projects, workspaces, agents, scripts, and daemon processes from your terminal."
nav: CLI
order: 2
category: Getting started
---

# CLI

The Padu CLI provides full terminal control over the Padu daemon. Anything you can do in the desktop GUI can also be driven from the command line or scripted by autonomous agents.

## Quick reference

```bash
padu run "fix the failing test suite"   # Start an agent task
padu ls                                # List active agent sessions
padu attach <id>                       # Stream agent transcript in real time
padu send <id> "also add type checks"  # Send a follow-up turn/instruction
padu logs <id>                         # View agent turn timeline and tool events
padu stop <id>                         # Stop an agent process
```

## Running agents

Use `padu run` to launch a new coding agent task:

```bash
# Run with default provider (Claude Code)
padu run "implement user authentication"

# Run with specific provider
padu run --provider codex "refactor the API layer"
padu run --provider opencode "fix typescript errors"

# Run in background and get the session ID immediately
padu run --background "run benchmark suite"

# Run inside an isolated Git worktree branch
padu run --new-workspace worktree --worktree-mode branch-off --new-branch feature/auth --base origin/main "implement auth flow"

# Attach to an existing workspace
padu run --workspace <workspace-id> "review recent changes"
```

## Managing sessions

```bash
padu ls                    # List running agents in current directory
padu ls -a                 # Include completed/stopped sessions
padu ls -g                 # List sessions across all project directories
padu ls -a -g --json       # Full session list as JSON

padu attach <id>           # Stream output live (Ctrl+C to detach without stopping agent)
padu send <id> "message"   # Send follow-up prompt
padu stop <id>             # Cancel/stop running agent
```

## Projects

Register project directories with the local daemon:

```bash
cd ~/dev/my-project
padu project create
padu project ls
padu project rename <project-id> "Web Service"
padu project delete <project-id>
```

Deleting a project from Padu archives its active workspaces and removes its entry from the daemon database without modifying files on disk.

## Workspaces & Worktrees

Create and inspect isolated workspaces:

```bash
# Local workspace (uses existing files in working directory)
padu workspace create --isolation local --path ~/dev/my-project --title main

# Git worktree workspace (branches off origin/main into an isolated directory)
padu workspace create \
  --isolation worktree \
  --path ~/dev/my-project \
  --mode branch-off \
  --new-branch feature/search \
  --worktree-slug feature-search \
  --base origin/main

# Checkout existing branch in a worktree
padu workspace create \
  --isolation worktree \
  --path ~/dev/my-project \
  --mode checkout-branch \
  --branch feature/billing

# List and manage workspaces
padu workspace ls
padu workspace rename <workspace-id> "Search overhaul"
padu workspace archive <workspace-id>
```

See [Git worktrees](/docs/worktrees) for full details on worktree hooks and lifecycle automation.

## Workspace scripts

Manage long-running development servers and test scripts defined in `padu.json`:

```bash
padu script ls
padu script start web
padu script stop web
```

See [Git worktrees](/docs/worktrees#scripts-and-services) for `padu.json` configuration syntax.

## Daemon management

Control the background process supervisor:

```bash
# Start the daemon
padu daemon start

# Start with bundled browser web client enabled
padu daemon start --web-ui

# Check daemon health and port
padu daemon status

# Reload config.json without restarting
padu reload

# Restart or stop the daemon
padu daemon restart
padu daemon stop
```

## Provider diagnostics

Verify installed CLI binaries and environment paths:

```bash
padu provider diagnostic claude
padu provider diagnostic codex
padu provider diagnostic opencode --json
```

The diagnostic prints the resolved executable path, version, model list, and the daemon's active search `PATH`. See [Troubleshooting](/docs/troubleshooting) for resolving `PATH` mismatches.

## Multi-agent scripting

Because Padu exposes structured JSON and quiet output flags, you can orchestrate multi-agent pipelines from bash or python:

```bash
# Agent A implements a feature in the background
session_id=$(padu run --background --quiet --provider claude "implement redis token bucket")

# Wait for session completion
padu wait "$session_id" --timeout 120

# Agent B validates the diff in the same workspace
padu run --provider codex --workspace "$session_id" "run test suite and check code quality"
```
