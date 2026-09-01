---
title: MCP & Tools reference
description: Reference for the built-in MCP tools agents use to manage subagents, workspaces, scripts, and terminals.
nav: Tools reference
order: 30
category: Orchestration
---

# Tools & MCP reference

Padu provides a comprehensive set of native tool definitions and an Model Context Protocol (MCP) server so that autonomous coding agents can spawn subagents, isolate workspaces, run test scripts, and coordinate parallel workflows.

Padu can inject these tools into new agent sessions automatically, or serve them over standard MCP transport.

## Mental model

- **Workspaces:** Define where code changes and branch isolation occur.
- **Parentage:** Tracks which lead agent spawned a worker subagent.
- An agent calling `create_agent` without a `workspaceId` spawns a subagent inside its existing workspace.
- Providing a `workspaceId` places the subagent in an isolated Git worktree workspace.

## Agent Management Tools

| Tool                 | Function                                                                                |
| -------------------- | --------------------------------------------------------------------------------------- |
| `create_agent`       | Create an agent, optionally placing it in an existing workspace with `workspaceId`.     |
| `send_agent_prompt`  | Send a task to a running agent.                                                         |
| `get_agent_status`   | Return the latest state snapshot for an agent session.                                  |
| `list_agents`        | List active and historical agent sessions.                                              |
| `cancel_agent`       | Abort an agent's active turn while preserving session context.                          |
| `archive_agent`      | Soft-delete an agent session and remove it from the active sidebar.                     |
| `kill_agent`         | Terminate an agent process permanently.                                                 |
| `update_agent`       | Update an agent title, model selection, thinking level, or runtime options.             |
| `get_agent_activity` | Return recent agent transcript entries, reasoning tokens, and tool calls.               |
| `set_agent_mode`     | Switch an agent's operational mode (e.g. plan mode, bypass mode).                       |

## Workspace & Worktree Tools

| Tool                | Function                                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| `create_workspace`  | Create a local or worktree-isolated workspace. Worktrees can branch off, check out a branch, or a PR. |
| `list_workspaces`   | List active workspaces, paths, and branch isolation details.                                          |
| `rename_workspace`  | Change the user-visible name of a workspace.                                                          |
| `archive_workspace` | Archive a workspace and clean up its managed worktree files.                                          |

## Workspace Script Tools

These tools manage commands defined in the project's `padu.json`:

| Tool                     | Function                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `list_workspace_scripts` | List configured scripts with lifecycle, port, proxy URL, and health metadata.          |
| `start_workspace_script` | Start a configured script or development server.                                        |
| `stop_workspace_script`  | Stop a running supervised process.                                                      |

See [Git worktrees](/docs/worktrees#scripts-and-services) for `padu.json` syntax.

## Terminal Supervision Tools

| Tool                 | Function                                                                     |
| -------------------- | ---------------------------------------------------------------------------- |
| `list_terminals`     | List active terminal sessions for the workspace.                             |
| `create_terminal`    | Create a new terminal session in a given directory.                          |
| `kill_terminal`      | Close and terminate a terminal session.                                      |
| `capture_terminal`   | Capture recent plain-text output from a terminal stream.                     |
| `send_terminal_keys` | Send input or control keys to a running terminal.                            |

## Provider Inspection Tools

| Tool               | Function                                                          |
| ------------------ | ----------------------------------------------------------------- |
| `list_providers`   | List available local agent providers and operational modes.       |
| `list_models`      | List available models for a given provider.                       |
| `inspect_provider` | Inspect provider capabilities, context windows, and feature flags. |
