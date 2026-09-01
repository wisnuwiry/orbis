# Multi-Platform Release Prerequisites & Bundling Architecture

This document summarizes the requirements and bundling scripts for distributing Padu on macOS, Linux, and Windows.

---

## 1. Platform Matrix

| Platform | Output Artifact | Bundling Script | Prerequisites | Signing |
| :--- | :--- | :--- | :--- | :--- |
| **macOS** | `.app`, `.dmg`, `.zip` | `scripts/bundle.sh` | Xcode / `codesign` | Apple Notarization or Ad-hoc (`-`) |
| **Linux** | `padu-*.tar.gz` | `scripts/bundle-linux.sh` | Vulkan driver, `libwayland`, `libx11` | GPG / SHA256 checksums |
| **Windows** | Portable zip, Setup `.exe` | `scripts/bundle-windows.ts` | MSVC Toolchain, Inno Setup 6.3+ | Authenticode (`.pfx`) |

---

## 2. macOS Bundling

- **Ad-Hoc Signing (No Apple Developer account needed)**:
  `scripts/bundle.sh release` creates an ad-hoc signed `.app` in `target/release`.
- **Notarized Production Release**:
  Requires `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_API_KEY_ID`, `APPLE_API_ISSUER`, and `APPLE_API_KEY`.
- **Appcast Feed**:
  `scripts/appcast.ts` generates Sparkle-compatible XML update feed.

---

## 3. Linux Bundling

- `scripts/bundle-linux.sh` produces `target/release/padu-<version>-<target>.tar.gz` with `bin/` and `share/` layout.
- Tested locally with:
  ```bash
  PADU_BUNDLE_PATH=target/release/padu-<version>-<target>.tar.gz sh website/public/install.sh
  ```
- `scripts/appcast-linux.ts` generates Linux update metadata.

---

## 4. Windows Bundling

- `bun scripts/bundle-windows.ts` builds both the zip and Inno Setup installer (`resources/windows/padu.iss`).
- Environment variables: `WINDOWS_CERTIFICATE` (base64 `.pfx`) and `WINDOWS_CERTIFICATE_PASSWORD`. If unset, unsigned binaries are produced for testing.
- `scripts/appcast-windows.ts` generates Windows update metadata.
