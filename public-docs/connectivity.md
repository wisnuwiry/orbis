---
title: Connectivity
description: Connect Padu desktop, web, and mobile clients to your daemon through local loopback, SSH, or Tailscale.
nav: Connectivity
order: 3
category: Getting started
---

# Connectivity

Padu follows a local-first client-server model. The desktop GUI, browser client, or mobile app communicates with a lightweight daemon (`padu daemon`) running on your machine or remote devbox over loopback sockets or WebSocket transport.

## 1. Local Loopback (Default)

When running the Padu desktop application on your computer, the daemon is started automatically on `127.0.0.1:4789`. No network setup is required.

## 2. Remote SSH Tunneling

You can run the Padu daemon on a remote Linux server or devbox and control it securely through OpenSSH from your desktop or CLI without exposing any ports publicly:

```bash
# Connect CLI to remote host via SSH
padu ls -a --host ssh://user@devbox.internal

# If daemon is running on a custom port
padu ls -a --host 'ssh://user@devbox.internal?daemonPort=4789'
```

In Padu Desktop, open **Settings → Add host → Remote SSH** and enter `ssh://user@devbox.internal`. Padu leverages your existing `~/.ssh/config` and SSH keys.

## 3. Tailscale / Private VPN (Recommended for Mobile)

To connect from mobile companion apps or external laptops without opening firewall ports, use a private mesh network like [Tailscale](https://tailscale.com) or WireGuard.

### Step 1: Find the daemon's Tailscale IP

On the host running the Padu daemon:

```bash
tailscale ip -4
# Example output: 100.101.102.103
```

### Step 2: Configure daemon listen address

In `~/.padu/config.json`, set the `daemon.listen` address to your Tailscale IP:

```json
{
  "$schema": "https://padu.dev/schemas/padu.config.v1.json",
  "version": 1,
  "daemon": {
    "listen": "100.101.102.103:4789"
  }
}
```

Restart or reload the daemon:

```bash
padu daemon restart
```

### Step 3: Connect client

1. Open Padu on your mobile device or browser.
2. Go to **Settings → Add host → Direct connection**.
3. Enter the Tailscale IP (`100.101.102.103`) and port `4789`.
4. If a password is configured in `config.json`, enter it and tap **Connect**.

## 4. Password Protection

When binding beyond localhost, protect your daemon with password authentication:

```bash
padu daemon set-password
```

Or set the environment variable:

```bash
PADU_PASSWORD=your-secret-password padu daemon start
```

When password authentication is enabled, all HTTP and WebSocket requests must authenticate. See [Configuration](/docs/configuration#password-authentication) for hashing details.
