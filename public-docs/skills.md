---
title: Orchestration skills
description: "Padu orchestration skills: package multi-agent workflows into reusable slash commands."
nav: Skills
order: 31
category: Orchestration
---

# Orchestration skills

Padu ships built-in orchestration skills that teach coding agents how to leverage Padu's CLI and MCP tools to spawn, coordinate, and review work from other agents.

## Installation & Setup

Skills are stored in `.agents/skills/` or `~/.agents/skills/` and can be invoked directly in conversation prompts or slash commands.

## Available Skills

### `/padu` — Reference Skill
Provides agents with the complete Padu CLI and MCP reference for creating workspaces, branching worktrees, and inspecting live transcripts.

```
/padu show me how to launch a subagent in a separate worktree branch
```

### `/padu-handoff` — Task Delegation
Hands off the active task to a specialized agent provider with a structured context briefing: task objective, files modified, error logs, and acceptance criteria.

```
/padu-handoff hand off the Redis rate limiter implementation to codex in a worktree
```

### `/padu-committee` — Multi-Agent Planning
Spins up two high-reasoning agents (e.g. Claude Opus and OpenAI Codex) in parallel to analyze a complex architectural problem without modifying code, then synthesizes their findings into an implementation plan.

```
/padu-committee analyze memory leaks in the WebSocket connection pool
```

### `/padu-advisor` — Second Opinion
Queries an external agent as an advisor for code review, edge case analysis, or UX sanity checks.

```
/padu-advisor are there any concurrency bugs in this transaction isolation logic?
```

## See Also

- [Tools reference](/docs/mcp) — Complete reference for Padu's agent and workspace MCP tools.
- [Workspaces](/docs/workspaces) — Understanding Padu's session and workspace hierarchy.
