---
title: Claude Code
description: Run Claude Code in Padu using your existing Claude plan.
nav: Claude Code
order: 23
category: Providers
---

# Claude Code

Padu runs Claude Code through the official `claude` CLI using the Claude Agent SDK.

## Does Claude Code cost extra in Padu?

No. Claude Code usage in Padu counts against your normal Claude plan limits. It does not require a separate pool of Agent SDK credits.

You still need a Claude plan that includes Claude Code, and your plan's usual usage limits apply.

## Getting started

Install and sign in to the Claude Code CLI on the machine running Padu. Padu uses that existing installation and account when you start a Claude Code agent.

If your Claude login expires, re-authenticate with the Claude Code CLI, then start a new Claude Code session in Padu. Existing Padu sessions keep the authentication they started with, so re-authenticating does not update a session that is already running.

## Use Claude Code in the Padu terminal

Claude Code also works great inside the Padu terminal. If you prefer the standard CLI experience, open a terminal in your workspace and run `claude` as usual.

You can use the terminal from Padu's desktop, web, or mobile app while keeping access to your workspace, git changes, and other Padu tools.

## See also

- [Supported providers](/docs/supported-providers), for other agents you can run alongside Claude Code.
- [Custom providers](/docs/custom-providers), for custom binaries, third-party endpoints, or multiple Claude profiles.
- [Padu vs Claude Desktop](/alternatives/claude-desktop), for a feature comparison.
