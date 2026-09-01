---
title: Troubleshooting
description: Why Padu can't find an installed provider CLI, and how to fix PATH and environment mismatches.
nav: Troubleshooting
order: 41
category: Reference
---

# Troubleshooting

Most setup questions come down to `PATH` environment resolution: when a CLI tool runs in your interactive terminal but Padu reports it as not installed.

## Provider Shows as "Not Installed"

Padu launches existing agent CLIs on your machine; it does not bundle them. It searches the system `PATH` captured during startup.

### 1. Run Provider Diagnostics

From your terminal, ask the daemon to inspect its resolved binary paths:

```bash
padu provider diagnostic claude
padu provider diagnostic codex
padu provider diagnostic opencode --json
```

Key diagnostic fields:
- **Resolved path** — Absolute path to the discovered executable (or `not found`).
- **Daemon PATH** — The search directories the daemon has access to.
- **Version** — Output when running the binary with `--version`.

### 2. Fixing PATH for Desktop App

When launching the desktop application from the macOS Dock or Linux app launcher, the operating system launches GUI applications with a minimal system environment.

Padu automatically spawns a login shell (`$SHELL -l -c`) at startup to inherit environment variables from your `.zshrc`, `.bashrc`, or `.profile`. If your shell configuration has errors or takes too long to load, Padu falls back to the system environment.

Ensure your tool version managers (such as `nvm`, `mise`, `asdf`, or Homebrew) are initialized in `.zprofile` / `.zshenv` or exported for non-interactive login shells.

### 3. Pinning Binary Paths Manually

If you prefer to explicitly specify binary locations, add an entry to `~/.padu/config.json`:

```json
{
  "agents": {
    "providers": {
      "claude": {
        "command": ["/Users/you/.nvm/versions/node/v20/bin/claude"]
      },
      "codex": {
        "command": ["/usr/local/bin/codex"]
      }
    }
  }
}
```

Then reload configuration:

```bash
padu reload
```

## Logs & Diagnostics

- **Daemon Logs:** `~/.padu/daemon.log`
- **Desktop App Logs:**
  - macOS: `~/Library/Logs/Padu/main.log`
  - Linux: `~/.config/Padu/logs/main.log`
  - Windows: `%APPDATA%\Padu\logs\main.log`

## See Also

- [Custom providers](/docs/custom-providers) — Add custom flags, endpoints, or profiles.
- [Configuration](/docs/configuration) — Full `config.json` reference.
- [GitHub Issues](https://github.com/wisnuwiry/padu/issues) — Report bugs and request features.
