---
title: Getting started
description: Install Padu and start running coding agents from anywhere.
nav: Getting started
order: 1
category: Getting started
---

# Getting started

Padu runs your coding agents on your machine and gives you a mobile, desktop, web, and CLI client to drive them from anywhere. Three common ways to install.

## Desktop app (recommended)

Download from [padu.dev/download](https://padu.dev/download) or the [GitHub releases page](https://github.com/wisnuwiry/padu/releases). Open it and you're done.

The desktop app bundles its own daemon and starts it automatically, no separate install required. On first launch you'll see a brief startup screen, then connect from your phone using **Settings → your host → Pair Device**.

## Server / CLI

For headless machines, dev boxes, or any setup where you want the daemon running without the desktop UI:

```bash
npm install -g @padu/cli
padu
```

Padu starts the daemon locally, then asks whether to enable the end-to-end encrypted relay and print a pairing QR code. If you decline, enter the daemon address manually over TCP, Tailscale, or another VPN.

The daemon can also serve the browser web app itself, so you can use the full UI without the hosted app. See [Self-hosting the web UI](/docs/web-ui).

Configuration and local state live under `PADU_HOME` (defaults to `~/.padu`).

## Docker

For servers, dev boxes, NAS devices, or homelab hosts, run the official image:

```bash
docker run -d --name padu \
  -p 6767:6767 \
  -e PADU_PASSWORD=change-me \
  -v "$PWD/padu-home:/home/padu" \
  -v "$PWD:/workspace" \
  ghcr.io/wisnuwiry/padu:latest
```

Then open `http://localhost:6767`.

The image runs the daemon and serves the bundled web UI. It does not bundle agent CLIs, so extend it with the agents you use. See [Docker](/docs/docker) for Compose, reverse proxy, agent install, and security examples.

## Where next

- [Connectivity](/docs/connectivity), connect through the relay or Tailscale.
- [Docker](/docs/docker), run the daemon and bundled web UI in a container.
- [Workspaces](/docs/workspaces), the project, workspace, and session model Padu is built around.
- [Providers](/docs/providers), what a provider is and how Padu wraps existing CLIs.
- [Orchestration](/docs/orchestration), let one agent delegate work to other providers and models.
- [Plugins](/docs/plugins), add trusted local surfaces, sidebar actions, daemon behavior, and composer attachments.
- [CLI reference](/docs/cli), every command.
- [Self-hosting the web UI](/docs/web-ui), serve the browser app from your own daemon.
- [GitHub repo](https://github.com/wisnuwiry/padu)
- [Report an issue](https://github.com/wisnuwiry/padu/issues)

## Prerequisites

Padu manages other agents, it doesn't ship one. Before it's useful, install at least one provider CLI yourself and make sure it works with your credentials. See [Supported providers](/docs/supported-providers) for the full list.

You'll also want the [GitHub CLI](https://cli.github.com/) (`gh`) installed and authenticated, Padu uses it for PR-aware worktrees and a few orchestration features.
