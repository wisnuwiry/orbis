---
title: Configuration
description: Configure Padu via config.json, environment variables, and CLI overrides.
nav: Configuration
order: 40
category: Reference
---

# Configuration

Padu loads configuration from a single JSON file located in your Padu home directory, with support for environment variables and command-line overrides.

## Configuration File Location

By default, Padu stores its configuration and state in `~/.padu`. The primary configuration file is:

```bash
~/.padu/config.json
```

You can change the home directory by setting the `PADU_HOME` environment variable or passing `--home` to `padu daemon start`.

## Precedence

Configuration values are resolved in the following priority:

1. Built-in defaults
2. `config.json`
3. Environment variables
4. Command-line flags

## Example Configuration

```json
{
  "$schema": "https://padu.dev/schemas/padu.config.v1.json",
  "version": 1,
  "daemon": {
    "listen": "127.0.0.1:4789",
    "hostnames": ["localhost", ".localhost"]
  },
  "worktrees": {
    "root": "~/.padu/worktrees"
  },
  "features": {
    "webUi": {
      "enabled": false
    }
  }
}
```

## Applying Changes

To reload changes from `config.json` into a running daemon without restarting active agent sessions:

```bash
padu reload
```

Settings that affect server binding (such as `daemon.listen` and `daemon.auth`) require a full daemon restart:

```bash
padu daemon restart
```

## Password Authentication

To secure the daemon against unauthorized network requests:

```bash
padu daemon set-password
```

This prompts for a password and writes the bcrypt hash into `~/.padu/config.json`:

```json
{
  "daemon": {
    "auth": {
      "password": "$2b$12$..."
    }
  }
}
```

Alternatively, provide `PADU_PASSWORD` via environment variable at startup:

```bash
PADU_PASSWORD=my-secret padu daemon start
```

## Worktree Directory Root

By default, isolated Git worktrees are placed in `$PADU_HOME/worktrees/`. You can relocate this directory by setting `worktrees.root`:

```json
{
  "worktrees": {
    "root": "/mnt/fast-ssd/padu-worktrees"
  }
}
```

## Logging Configuration

```json
{
  "log": {
    "console": {
      "level": "info",
      "format": "pretty"
    },
    "file": {
      "level": "trace",
      "path": "daemon.log",
      "rotate": {
        "maxSize": "10m",
        "maxFiles": 2
      }
    }
  }
}
```

## Common Environment Variables

- `PADU_HOME` — Custom home directory (defaults to `~/.padu`)
- `PADU_LISTEN` — Override daemon listening address and port (defaults to `127.0.0.1:4789`)
- `PADU_PASSWORD` — Set authentication password for the daemon
- `PADU_HOSTNAMES` — Comma-separated allowed hostnames for DNS rebinding protection
- `PADU_WEB_UI_ENABLED` — Set to `true` to enable the bundled browser web interface
- `PADU_LOG_CONSOLE_LEVEL` — Console log level (`debug`, `info`, `warn`, `error`)

## JSON Schema Validation

Add the following `$schema` property to `config.json` for editor validation and autocompletion:

```json
{
  "$schema": "https://padu.dev/schemas/padu.config.v1.json"
}
```
