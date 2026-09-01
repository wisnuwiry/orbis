# Padu on Linux

## Install

```sh
curl -fsSL https://padu.dev/install.sh | sh
```

The script needs no root. It unpacks the release tarball into
`~/.local/padu.app` and installs the desktop entry into
`~/.local/share/applications`, so **Padu appears in your applications menu** —
you can also launch it from a terminal via `padu` command. Run the script again to
upgrade manually; the installed app also keeps itself current.

Padu expects:

- **glibc 2.35 or newer** — Ubuntu 22.04, Debian 12, Fedora 36, and anything
  more recent. Releases are built on Ubuntu 22.04, so older distributions must
  build from source.
- **A working Vulkan or OpenGL driver.** Padu renders through wgpu, which tries
  Vulkan first and falls back to GL. Software rasterizers (lavapipe, llvmpipe)
  are accepted, so it can run in a VM, but see the note below.
- **x86_64 or aarch64.** Other architectures build from source.
- `xdg-desktop-portal` for native file dialogs.
- `curl` or `wget` for installation and update downloads.

Set `PADU_VERSION` to install a specific version rather than the latest.

## Installing manually

The script is a convenience, not a requirement. Download
`padu-<version>-<target>.tar.gz` from
[releases.padu.dev](https://releases.padu.dev) or the
[GitHub release](https://github.com/wisnuwiry/padu/releases), then unpack it
wherever you like:

```sh
mkdir -p ~/.local/padu.app
tar -xzf padu-<version>-<target>.tar.gz --strip-components=1 -C ~/.local/padu.app
ln -sf ~/.local/padu.app/bin/padu ~/.local/bin/padu   # optional
```

The archive uses an install-prefix layout (`bin/`, `share/`) beneath one
versioned directory, so `--strip-components=1` into a prefix such as
`/usr/local` works too.

**Keep `bin/` intact.** Padu launches `padu-daemon` and `padu-updater` from its
own directory, so copying `bin/padu` somewhere on its own leaves it unable to
start the daemon or update. A symlink is fine — Padu resolves it back to the
real path.

Installing the desktop entry is the part that matters — it is how the app is
launched normally, and it is what associates the running window with its icon
and name (Padu reports the Wayland `app_id` / X11 `WM_CLASS` `dev.padu`, which
matches the entry's filename). Install the packaged file and point it at the
install (the packaged copy uses bare `Exec=padu` and `Icon=dev.padu` names so it
can be relocated):

```sh
install -D ~/.local/padu.app/share/applications/dev.padu.desktop \
  -t ~/.local/share/applications
sed -i "s|^Exec=padu$|Exec=$HOME/.local/padu.app/bin/padu|" \
  ~/.local/share/applications/dev.padu.desktop
sed -i "s|^Icon=dev.padu$|Icon=$HOME/.local/padu.app/share/icons/hicolor/256x256/apps/dev.padu.png|" \
  ~/.local/share/applications/dev.padu.desktop
```

## Updating

Tarball installs under the user's home directory update themselves. Padu
checks once per launch by default; an available release appears in the sidebar
footer. Clicking it validates the staged installation, quits through Padu's
normal draft/state saves, swaps the complete prefix, and relaunches. If the new
build exits before opening its window, the helper restores and relaunches the
previous version.

Every archive is verified with the same Ed25519 release key used by the macOS
and Windows updaters. The architecture-specific feeds are:

- `https://releases.padu.dev/appcast-linux-x86_64.xml`
- `https://releases.padu.dev/appcast-linux-aarch64.xml`

Use **Check for Updates** for an explicit check, or disable launch checks in
**Settings → General → Automatic updates**. System-wide installs such as
`/usr/local`, builds without the managed-install marker, root sessions, and
package-manager-owned builds do not modify themselves; upgrade those through
their original installation method. Re-running `install.sh` remains a safe
manual fallback for the default `~/.local/padu.app` install.

## Uninstalling

```sh
curl -fsSL https://padu.dev/install.sh | sh -s -- --uninstall
```

This removes `~/.local/padu.app`, the symlink, and the desktop entry. Projects
and settings stay in `~/.padu`; delete that directory to remove them too.

## Building from source

See [CONTRIBUTING.md](../CONTRIBUTING.md) for build prerequisites, then
produce the same archive this page installs with:

```sh
./scripts/bundle-linux.sh
```

To exercise the install script against that local build:

```sh
PADU_BUNDLE_PATH=target/release/padu-<version>-<target>.tar.gz \
  sh apps/landing/public/install.sh
```

## Running in a virtual machine

VMs usually have no GPU passthrough, so Mesa falls back to a software
rasterizer. That works in principle — wgpu accepts a CPU adapter — but both
lavapipe (Vulkan) and llvmpipe (GL) JIT-compile shaders through LLVM, and that
path is fragile: on Fedora 44 aarch64 (mesa 26.0.3 + LLVM 22.1) it segfaults
inside `gallivm_jit_function` while compiling a fragment shader. The crash is
in the driver, not in Padu, and no application-side setting avoids it.

If the app dies on its first frame in a VM, check `coredumpctl info` for a
backtrace through `libvulkan_lvp.so` or `libgallium`. The reliable fix is to
give the guest a real GL driver — on UTM that means the QEMU backend with
virtio-gpu-gl (virgl) rather than Apple Virtualization, which offers Linux
guests no 3D at all. `VK_DRIVER_FILES=/nonexistent.json` hides the software
Vulkan driver so wgpu takes the GL path instead.
