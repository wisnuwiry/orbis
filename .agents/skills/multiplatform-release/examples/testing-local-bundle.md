# Example: Building & Testing Local Release Bundles

Instructions to test release artifacts locally without pushing to GitHub or publishing update feeds.

---

### 1. macOS Local Bundle
```bash
# Build and sign ad-hoc debug or release app:
./scripts/bundle.sh release

# Validate the generated .app launch:
open "target/release/Padu.app"
```

---

### 2. Linux Local Bundle
```bash
# Build Linux release archive:
./scripts/bundle-linux.sh

# Exercise local install script:
PADU_BUNDLE_PATH="$(ls target/release/padu-*.tar.gz | head -1)" sh website/public/install.sh
```

---

### 3. Windows Local Bundle
On Windows with Inno Setup installed:
```cmd
bun scripts/bundle-windows.ts
```
The resulting portable zip and setup installer land in `target/release`.
