---
title: Codex
description: Run Codex in Padu using the official Codex CLI and your existing OpenAI account.
nav: Codex
order: 24
category: Providers
---

# Codex

Padu runs Codex through the official `codex` CLI and its app-server interface.

## Does Codex cost extra in Padu?

No. Padu does not add a charge for Codex. Sign in to the Codex CLI with ChatGPT to use the access included with your ChatGPT plan, or sign in with an API key for usage billed through your OpenAI Platform account.

Your plan's normal Codex limits and OpenAI's standard API pricing still apply.

## Getting started

Install the [Codex CLI](https://learn.chatgpt.com/docs/codex/cli) on the machine running Padu:

```bash
npm install -g @openai/codex
```

Sign in with ChatGPT for subscription access:

```bash
codex login
```

Or sign in with an API key for usage billed through your OpenAI Platform account:

```bash
# macOS or Linux
printenv OPENAI_API_KEY | codex login --with-api-key
```

```powershell
# Windows PowerShell
$env:OPENAI_API_KEY | codex login --with-api-key
```

Then confirm the CLI starts:

```bash
codex
```

Padu uses this installation and its existing authentication when you start a Codex agent.

## Codex is missing in Padu

The ChatGPT desktop app and the Codex CLI are separate installs. Installing the desktop app does not make the `codex` command available to Padu.

Check whether the CLI is on your `PATH`:

```bash
# macOS or Linux
which -a codex

# Windows
where.exe codex
```

If the command is not found:

1. Install the [Codex CLI](https://learn.chatgpt.com/docs/codex/cli).
2. Sign in with ChatGPT or an API key using the commands above. See [Codex authentication](https://learn.chatgpt.com/docs/auth).
3. Restart Padu if its daemon was already running when you installed the CLI.
4. In Padu, open **Settings → Providers → Codex** and select **Refresh**.

The provider should become available once Padu can find and start the `codex` command.

## Use Codex in the Padu terminal

Codex also works inside the Padu terminal. Open a terminal in your workspace and run `codex` for the standard CLI experience while keeping access to your workspace, git changes, and other Padu tools.

## See also

- [Supported providers](/docs/supported-providers), for other agents you can run alongside Codex.
- [Custom providers](/docs/custom-providers), for custom binaries, third-party endpoints, or multiple Codex profiles.
- [Padu vs Codex app](/alternatives/codex-app), for a feature comparison.
