---
title: Custom providers
description: Configure custom providers, alternative endpoints, multiple profiles, custom binaries, and ACP agents in ~/.padu/config.json.
nav: Custom providers
order: 24
category: Providers
---

# Custom providers

Padu supports custom provider configurations under `agents.providers` in `~/.padu/config.json`. You can:

- **Extend a built-in provider** to point at alternative API endpoints (proxies, enterprise gateways, or self-hosted models).
- **Configure multiple profiles** for the same provider (e.g., Personal vs Work credentials).
- **Override the binary path** to target nightly builds, wrappers, or isolated environments.
- **Add ACP-compatible agents** speaking the Agent Client Protocol over `stdio`.
- **Disable** providers you don't use.

Run `padu reload` after editing `~/.padu/config.json`. Changes apply immediately to new sessions without restarting running agents.

## 1. Multiple Profiles for Built-in Providers

Declare multiple profiles with separate API credentials or custom model lists:

```json
{
  "agents": {
    "providers": {
      "claude-work": {
        "extends": "claude",
        "label": "Claude (Work)",
        "env": {
          "ANTHROPIC_API_KEY": "sk-ant-work-..."
        }
      },
      "claude-personal": {
        "extends": "claude",
        "label": "Claude (Personal)",
        "env": {
          "ANTHROPIC_API_KEY": "sk-ant-personal-..."
        }
      }
    }
  }
}
```

## 2. Custom Binary Path

To pin a specific binary location:

```json
{
  "agents": {
    "providers": {
      "claude": {
        "command": ["/opt/claude-nightly/bin/claude"]
      }
    }
  }
}
```

## 3. Alternative Endpoints (Anthropic-Compatible APIs)

Route Claude Code through an Anthropic-compatible API gateway or regional proxy:

```json
{
  "agents": {
    "providers": {
      "custom-claude": {
        "extends": "claude",
        "label": "Custom Gateway",
        "env": {
          "ANTHROPIC_API_KEY": "your-key",
          "ANTHROPIC_BASE_URL": "https://gateway.internal.example.com/v1"
        },
        "models": [
          { "id": "claude-3-7-sonnet-20250219", "label": "Sonnet 3.7", "isDefault": true }
        ]
      }
    }
  }
}
```

## 4. Generic ACP Agents

Any agent speaking the [Agent Client Protocol (ACP)](https://agentclientprotocol.com) over standard input/output (`stdio`) can be registered with `extends: "acp"`:

```json
{
  "agents": {
    "providers": {
      "gemini-acp": {
        "extends": "acp",
        "label": "Google Gemini (ACP)",
        "command": ["gemini", "--acp"]
      }
    }
  }
}
```

## 5. Disabling a Provider

To hide a provider from the GUI selection menu:

```json
{
  "agents": {
    "providers": {
      "copilot": {
        "enabled": false
      }
    }
  }
}
```

## See Also

- [Providers overview](/docs/providers) — Understanding Padu's agent adapter system.
- [Supported providers](/docs/supported-providers) — Full list of natively supported coding agents.
- [Troubleshooting](/docs/troubleshooting) — Fixing `PATH` resolution and command execution issues.
