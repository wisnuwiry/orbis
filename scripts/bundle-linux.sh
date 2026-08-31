#!/usr/bin/env bash

set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

target_dir="${CARGO_TARGET_DIR:-target}"
version="$(cargo metadata --no-deps --format-version 1 | sed -n 's/.*"name":"orbis","version":"\([^"]*\)".*/\1/p')"
target_triple="$(rustc -vV | sed -n 's/^host: //p')"
package="orbis-${version}-${target_triple}"
archive="$target_dir/release/$package.tar.gz"
staging="$(mktemp -d)"
trap 'rm -rf -- "$staging"' EXIT

cargo build --locked --release \
  --package orbis --bin orbis --bin orbis-updater \
  --package orbis-daemon --bin orbis-daemon

package_dir="$staging/$package"
install -Dm755 "$target_dir/release/orbis" "$package_dir/bin/orbis"
install -Dm755 "$target_dir/release/orbis-updater" "$package_dir/bin/orbis-updater"
install -Dm755 "$target_dir/release/orbis-daemon" "$package_dir/bin/orbis-daemon"
install -Dm644 resources/linux/sh.orbis.desktop \
  "$package_dir/share/applications/sh.orbis.desktop"
install -Dm644 resources/linux/self-update-v1 \
  "$package_dir/share/orbis/self-update-v1"
install -Dm644 website/public/app-icon.png \
  "$package_dir/share/icons/hicolor/256x256/apps/sh.orbis.png"
install -Dm644 LICENSE "$package_dir/share/licenses/orbis/LICENSE"

mkdir -p "$(dirname "$archive")"
tar -C "$staging" -czf "$archive" "$package"
printf 'Created %s\n' "$archive"
