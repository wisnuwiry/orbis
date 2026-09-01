# Padu Mobile

Expo client for connecting to one or more remote Padu daemons from iOS and
Android.

## Run

From the repository root:

```sh
bun install
bun --filter @padu/mobile ios
bun --filter @padu/mobile android
bun --filter @padu/mobile web
```

## Connect

In Padu Desktop, enable the remote daemon and copy its WebSocket address and
token. Add those values in the mobile app. Use `wss://` outside a trusted LAN
or private tailnet; the token grants full control of the daemon host.

Saved profile metadata stays in app storage. On iOS and Android, daemon tokens
are stored separately in the device keychain through Expo SecureStore.

Padu is licensed under the repository's GNU GPL v3.0-only license.
