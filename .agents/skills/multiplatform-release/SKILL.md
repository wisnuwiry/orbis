---
name: multiplatform-release
description: >-
  Build, bundle, sign, and test release packages across macOS (DMG/ad-hoc),
  Linux (tar.gz/install.sh), and Windows (Inno Setup/portable zip), and update appcast feeds.
---

# Multi-Platform Release & Packaging Skill

This skill provides step-by-step guidance for building, packaging, code-signing, and testing release bundles for macOS, Linux, and Windows.

---

## When to Use This Skill

- Preparing a new version release of Padu.
- Testing packaging scripts (`scripts/bundle.sh`, `scripts/bundle-linux.sh`, `scripts/bundle-windows.ts`).
- Debugging code signing, notarization, or Inno Setup installer issues.
- Generating and verifying Sparkle / platform appcast update feeds.

---

## Workflow Steps

### Step 1: Version & Changelog Verification
1. Verify version numbers in `Cargo.toml` and `package.json`.
2. Update `CHANGELOG.md` using `bun ./scripts/changelog.ts`.

---

### Step 2: Build & Package Local Bundles
- **macOS**:
  ```bash
  ./scripts/bundle.sh release
  ```
- **Linux**:
  ```bash
  ./scripts/bundle-linux.sh
  ```
- **Windows**:
  ```bash
  bun scripts/bundle-windows.ts
  ```

---

### Step 3: Verify Appcast Feeds
Generate and validate update metadata:
```bash
bun ./scripts/appcast.ts
bun ./scripts/appcast-linux.ts
bun ./scripts/appcast-windows.ts
```

---

### Step 4: Validate Release CI Workflows
Check configuration in `.github/workflows/release.yml` and ensure environment secrets are properly wired for production builds.

---

## References & Examples

- [Platform Prerequisites & Toolchain Setup](./references/platform-prerequisites.md)
- [Testing Local Bundles Guide](./examples/testing-local-bundle.md)
