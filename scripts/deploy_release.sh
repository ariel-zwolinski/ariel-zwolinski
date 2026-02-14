#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/kalkulator}"
ARCHIVE_PATH="${1:-/tmp/dist.tar.gz}"
RELEASE_ID="${RELEASE_ID:-$(date +%F_%H%M%S)}"

if [[ ! -f "$ARCHIVE_PATH" ]]; then
  echo "[ERROR] Archive not found: $ARCHIVE_PATH" >&2
  echo "[HINT] Upload dist.tar.gz first, e.g. scp dist.tar.gz user@server:/tmp/dist.tar.gz" >&2
  exit 1
fi

RELEASES_DIR="$APP_DIR/releases"
TARGET_DIR="$RELEASES_DIR/$RELEASE_ID"

mkdir -p "$TARGET_DIR"
tar -xzf "$ARCHIVE_PATH" -C "$TARGET_DIR"
ln -sfn "$TARGET_DIR" "$APP_DIR/current"

if command -v nginx >/dev/null 2>&1; then
  nginx -t
fi

if command -v systemctl >/dev/null 2>&1; then
  systemctl reload nginx || true
fi

echo "[OK] Release deployed: $TARGET_DIR"
echo "[OK] Current symlink: $APP_DIR/current"
