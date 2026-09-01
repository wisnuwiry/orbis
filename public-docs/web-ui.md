---
title: Self-hosting the web UI
description: Serve the Padu web client directly from your daemon over LAN, Tailscale, reverse proxy, or tunnel.
nav: Web UI
order: 4
category: Getting started
---

# Self-hosting the web UI

Padu's daemon can serve the browser web application directly from the same HTTP server it uses for the RPC API and WebSocket stream. You can access the official hosted client at [app.padu.dev](https://app.padu.dev) or self-host the entire interface locally.

## Enabling the Web UI

To enable the bundled web UI on the daemon, start it with the `--web-ui` flag:

```bash
padu daemon start --web-ui
```

Or enable it persistently in `~/.padu/config.json`:

```json
{
  "features": {
    "webUi": {
      "enabled": true
    }
  }
}
```

Then open your browser and navigate to:

```
http://localhost:4789/
```

## How It Works

The web client is served from the same origin as the daemon API. When you load the page in a browser, it automatically connects to the local WebSocket endpoint at `/ws`.

## Reverse Proxy Configuration

If you want to expose the web client securely over HTTPS on your domain, put a reverse proxy (such as Caddy or Nginx) in front of `127.0.0.1:4789`.

### Caddy (Recommended)

Caddy manages TLS certificates, headers, and WebSocket upgrades automatically:

```caddy
padu.example.com {
  reverse_proxy 127.0.0.1:4789
}
```

### Nginx

```nginx
map $http_upgrade $connection_upgrade {
  default upgrade;
  ''      close;
}

server {
  listen 443 ssl http2;
  server_name padu.example.com;

  ssl_certificate     /etc/letsencrypt/live/padu.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/padu.example.com/privkey.pem;

  client_max_body_size 100m;

  location / {
    proxy_pass http://127.0.0.1:4789;
    proxy_http_version 1.1;

    # WebSocket upgrade
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;

    # Headers for origin detection
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    # Unbuffered streaming for real-time tokens
    proxy_buffering off;
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
  }
}
```

## Security Best Practices

When exposing the daemon beyond `localhost`:
1. **Set a daemon password:** Run `padu daemon set-password` so all requests require authentication.
2. **Use HTTPS / TLS:** Protect credentials and WebSocket traffic across public networks.
3. **Allow your domain:** Add your hostname to `daemon.hostnames` in `config.json` to pass DNS rebinding checks.

See [Security](/docs/security) and [Configuration](/docs/configuration) for more details.
