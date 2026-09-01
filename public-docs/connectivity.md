---
title: Connectivity
description: Connect Padu desktop, web, and mobile clients to your daemon through local loopback, SSH, or Tailscale.
nav: Connectivity
order: 2
category: Getting started
---

# Connectivity

Padu follows a local-first client-server model. The desktop GUI, browser client, or mobile companion communicates with a lightweight daemon (`padu-daemon`) running on your machine or remote devbox over loopback sockets or WebSocket transport.

## 1. Local Loopback (Default)

When running the Padu desktop application on your computer, the daemon is started automatically on `127.0.0.1:4789`. No network setup is required.

## 2. Remote SSH Tunneling

You can run the Padu daemon on a remote Linux server or devbox and tunnel to it securely through OpenSSH from your desktop without exposing any ports publicly:

In Padu Desktop, open **Settings → Add host → Remote SSH** and enter `ssh://user@devbox.internal`. Padu leverages your existing `~/.ssh/config` and SSH keys.

## 3. Tailscale / Private VPN (Recommended for Remote Access)

To connect from mobile companion apps or external laptops without opening firewall ports, use a private mesh network like [Tailscale](https://tailscale.com) or WireGuard.

### Step 1: Find the daemon machine's Tailscale IP

On the host running the Padu daemon:

```bash
tailscale ip -4
# Example output: 100.101.102.103
```

### Step 2: Start daemon on Tailscale interface

Start the daemon binding to the Tailscale IP:

```bash
padu-daemon --bind 100.101.102.103:4789 --allow-non-loopback
```

### Step 3: Connect client

1. Open Padu on your mobile device or browser.
2. Go to **Settings → Add host → Direct connection**.
3. Enter the Tailscale IP (`100.101.102.103`) and port `4789`.
4. Tap **Connect**.
