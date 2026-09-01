---
title: Troubleshooting
description: Why Padu can't find an installed provider CLI, and how to fix PATH and environment mismatches.
nav: Troubleshooting
order: 31
category: Reference
---

# Troubleshooting

Most setup questions come down to `PATH` environment resolution: when a CLI tool runs in your interactive terminal but Padu reports it as not installed.

## Provider Shows as "Not Installed"

Padu launches existing agent CLIs installed on your machine; it does not bundle them. It searches the system `PATH` captured during startup.

### 1. Fixing PATH for Desktop App

When launching the desktop application from the macOS Dock or Linux app launcher, the operating system launches GUI applications with a minimal system environment.

Padu automatically spawns a login shell (`$SHELL -l -c`) at startup to inherit environment variables from your `.zshrc`, `.bashrc`, or `.profile`. If your shell configuration has errors or takes too long to load, Padu falls back to the system environment.

Ensure your tool version managers (such as `nvm`, `mise`, `asdf`, or Homebrew) are initialized in `.zprofile` / `.zshenv` or exported for non-interactive login shells.

### 2. Pinning Binary Paths Manually

If you prefer to explicitly specify binary locations, open **Settings → Providers** in Padu Desktop or edit `~/.padu/settings.json`:

```json
{
  "provider_binary_overrides": {
    "claude": "/opt/homebrew/bin/claude",
    "codex": "/usr/local/bin/codex",
    "opencode": "/Users/you/.local/bin/opencode"
  }
}
```

## Logs & Diagnostics

- **Desktop App Logs:**
  - macOS: `~/Library/Logs/Padu/main.log`
  - Linux: `~/.config/Padu/logs/main.log`
  - Windows: `%APPDATA%\Padu\logs\main.log`

## See Also

- [Configuration & Settings](/docs/configuration) — Full `settings.json` reference.
- [Supported providers](/docs/supported-providers) — List of all supported agent CLIs.
- [GitHub Issues](https://github.com/wisnuwiry/padu/issues) — Report bugs and request features.
