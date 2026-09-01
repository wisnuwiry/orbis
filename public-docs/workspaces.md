---
title: Workspaces
description: Understand how Padu groups projects, parallel agent sessions, and Git worktrees.
nav: Workspaces
order: 10
category: Architecture
---

# Workspaces

Padu is organized around **workspaces**, not isolated chats.

A workspace is the dedicated environment where a task happens. It maps to a project working directory and can contain multiple parallel agent sessions, terminals, and diff inspectors active simultaneously.

## Projects Contain Workspaces

The sidebar organizes your work by project. A project is any local Git repository or folder on your computer.

Inside each project, you can create multiple workspaces:
```
my-app
├── main (local checkout)
├── fix-auth-race-condition (isolated worktree)
└── redesign-settings-modal (isolated worktree)
```

## Workspaces Contain Sessions

Within a single workspace, multiple AI agents can collaborate on the same task. You can run one agent to implement changes, launch another to review the diff, and open a terminal to run test suites—all within the same context.

## Workspace Isolation Modes

Every workspace in Padu supports two isolation modes:

1. **Local Isolation:** Uses your existing repository checkout directly. Recommended for quick fixes, diff reviews, or single-agent tasks.
2. **Worktree Isolation:** Automatically creates an isolated Git worktree on a dedicated branch beneath `~/.padu/worktrees/`. Parallel agents can edit files and commit changes without touching your main working directory or creating merge conflicts.

See [Git worktrees](/docs/worktrees) for full details on worktree lifecycle and branch management.
