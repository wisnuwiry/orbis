---
title: Security & Privacy
description: "Padu's security architecture: 100% local-first data model, OS keychain integration, and zero external telemetry."
nav: Security
order: 13
category: Architecture
---

# Security & Privacy

Padu is designed as a **100% local-first control plane** for AI coding agents. Your source code, conversation transcripts, prompts, and credentials never leave your hardware.

## Core Security Principles

### 1. Zero Cloud Intermediary & Zero Telemetry
- The Padu application and background daemon contain **no analytics trackers**, telemetry beacons, advertising SDKs, or crash uploaders.
- All session databases, Git worktrees, and checkpoint logs are stored strictly on your local disk in `.padu/` and OS-specific user data directories.

### 2. OS Keychain Credential Storage
- Provider API keys and authentication tokens are kept in your operating system's native secure store (macOS Keychain, Linux Secret Service / Keyutils, Windows Credential Manager).
- Padu never uploads, proxies, or transmits your API keys to central servers.

### 3. Direct Subprocess & Provider Communication
- Agent CLIs (like `claude`, `codex`, and `opencode`) run as local child subprocesses supervised via standard streams (`stdio` and PTY).
- When agents call LLM endpoints, the HTTP/WebSocket requests originate directly from your computer to the AI provider's API (e.g. `api.anthropic.com` or `api.openai.com`) using your own credentials.

## Daemon Access Controls

### Loopback by Default
By default, the daemon binds exclusively to `127.0.0.1:4789`, accepting connections only from processes on the same machine.

### DNS Rebinding Protection
When listening on a network interface, Padu inspects incoming `Host` headers against a configured hostname allowlist (`daemon.hostnames`) to prevent DNS rebinding attacks from malicious websites:

```json
{
  "daemon": {
    "hostnames": ["localhost", ".internal.mycompany.com"]
  }
}
```

### Password Authentication
When exposing the daemon over a local network or VPN, enable bcrypt-hashed password authentication in `~/.padu/config.json`:

```bash
padu daemon set-password
```

## Vulnerability Reporting

If you discover a potential security vulnerability in Padu, please review [SECURITY.md](https://github.com/wisnuwiry/padu/blob/main/SECURITY.md) on GitHub or contact the maintainers confidentially at [support@padu.dev](mailto:support@padu.dev).
