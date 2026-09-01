#!/usr/bin/env bash

set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

target_dir="${CARGO_TARGET_DIR:-target}"
version="$(cargo metadata --no-deps --format-version 1 | sed -n 's/.*"name":"padu","version":"\([^"]*\)".*/\1/p')"
target_triple="$(rustc -vV | sed -n 's/^host: //p')"
package="padu-${version}-${target_triple}"
archive="$target_dir/release/$package.tar.gz"
staging="$(mktemp -d)"
trap 'rm -rf -- "$staging"' EXIT

cargo build --locked --release \
  --package padu --bin padu --bin padu-updater \
  --package padu-daemon --bin padu-daemon

package_dir="$staging/$package"
install -Dm755 "$target_dir/release/padu" "$package_dir/bin/padu"
install -Dm755 "$target_dir/release/padu-updater" "$package_dir/bin/padu-updater"
install -Dm755 "$target_dir/release/padu-daemon" "$package_dir/bin/padu-daemon"
install -Dm644 resources/linux/dev.padu.desktop \
  "$package_dir/share/applications/dev.padu.desktop"
install -Dm644 resources/linux/self-update-v1 \
  "$package_dir/share/padu/self-update-v1"
install -Dm644 website/public/app-icon.png \
  "$package_dir/share/icons/hicolor/256x256/apps/dev.padu.png"
install -Dm644 LICENSE "$package_dir/share/licenses/padu/LICENSE"

mkdir -p "$(dirname "$archive")"
tar -C "$staging" -czf "$archive" "$package"
printf 'Created %s\n' "$archive"
