---
title: Git worktrees
description: Run parallel AI agents safely with automated Git worktree directory and branch isolation.
nav: Git worktrees
order: 11
category: Architecture
---

# Git worktrees

When you run multiple coding agents concurrently on the same codebase, having them modify the same working tree creates file locks, overwritten edits, and git status conflicts.

Padu solves this with **first-class Git worktree isolation**.

## How Padu Manages Worktrees

When you create a worktree-isolated workspace or task:
1. Padu creates a dedicated working directory under `~/.padu/worktrees/<project-id>/<slug>`.
2. A new Git branch `padu/<slug>` is created from your current branch (or a specified base branch, such as `main` or `origin/main`).
3. The AI agent executes commands and edits files strictly within this isolated directory.
4. Your main checkout remains clean and untouched while the agent works in the background.

```
~/.padu/worktrees/
└── d41d8cd98f00b204e9800998ecf8427e/  # project ID
    ├── fix-auth-flow/                 # isolated worktree 1 (branch: padu/fix-auth-flow)
    └── update-dependencies/           # isolated worktree 2 (branch: padu/update-dependencies)
```

## Reviewing and Merging Changes

Because worktrees are standard Git branches:
- You can inspect the real-time split diff in Padu's native diff viewer.
- When the agent finishes, you can review commits, merge the branch into your main branch, or open a Pull Request directly using Git or the `gh` CLI.
- Archiving or deleting the workspace cleans up the worktree directory from disk.

## See Also

- [Workspaces overview](/docs/workspaces) — Understanding Padu's workspace container model.
- [Security & Privacy](/docs/security) — How local-first isolation keeps your code safe.
