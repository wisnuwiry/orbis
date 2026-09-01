---
title: Codex
description: Run OpenAI Codex in Padu using the official Codex CLI and your OpenAI credentials.
nav: Codex
order: 23
category: Providers
---

# Codex

Padu runs OpenAI Codex through the official `codex` CLI and its structured app-server interface.

## Does Codex cost extra in Padu?

No. Padu does not charge any additional fees for Codex. Sign in to the Codex CLI with your OpenAI/ChatGPT subscription or API key, and usage is billed directly through your OpenAI account.

## Getting started

Install the Codex CLI on the machine running Padu:

```bash
npm install -g @openai/codex
```

Sign in with your OpenAI account:

```bash
codex login
```

Or authenticate via API key:

```bash
# macOS / Linux
printenv OPENAI_API_KEY | codex login --with-api-key

# Windows PowerShell
$env:OPENAI_API_KEY | codex login --with-api-key
```

Confirm that the CLI starts:

```bash
codex
```

Padu automatically discovers `codex` on your `PATH` and uses your local authentication tokens.

## Running Codex in Padu

- **Desktop GUI:** Select **OpenAI Codex** from the provider dropdown.
- **Integrated Terminal:** Run `codex` directly inside the workspace terminal.

## Troubleshooting Codex

If Codex shows as **Not installed** in Padu:

1. Verify `codex` is accessible on your system `PATH`:
   ```bash
   which -a codex
   ```
2. In Padu Desktop, open **Settings → Providers → Codex** and select **Refresh**.
3. If necessary, provide the absolute binary path in `~/.padu/settings.json`:
   ```json
   {
     "provider_binary_overrides": {
       "codex": "/usr/local/bin/codex"
     }
   }
   ```

See [Troubleshooting](/docs/troubleshooting) for more details on `PATH` resolution.

## See also

- [Supported providers](/docs/supported-providers) — Full catalog of agents supported in Padu.
- [Configuration](/docs/configuration) — Configure daemon settings and binary overrides.
