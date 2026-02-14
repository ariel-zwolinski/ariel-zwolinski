#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/kalkulator}"
ARCHIVE_PATH="${1:-/tmp/dist.tar.gz}"
RELEASE_ID="${RELEASE_ID:-$(date +%F_%H%M%S)}"
NGINX_CONFIG_PATH="${NGINX_CONFIG_PATH:-/etc/nginx/sites-enabled/kalkulator}"

if [[ ! -f "$ARCHIVE_PATH" ]]; then
  echo "[ERROR] Archive not found: $ARCHIVE_PATH" >&2
  echo "[HINT] Upload dist.tar.gz first, e.g. scp dist.tar.gz user@server:/tmp/dist.tar.gz" >&2
  exit 1
fi

if ! tar -tzf "$ARCHIVE_PATH" >/dev/null 2>&1; then
  echo "[ERROR] Archive is not a valid tar.gz file: $ARCHIVE_PATH" >&2
  exit 1
fi

RELEASES_DIR="$APP_DIR/releases"
TARGET_DIR="$RELEASES_DIR/$RELEASE_ID"
mkdir -p "$RELEASES_DIR"

if [[ -e "$TARGET_DIR" ]]; then
  echo "[ERROR] Release directory already exists: $TARGET_DIR" >&2
  exit 1
fi

mkdir -p "$TARGET_DIR"
tar -xzf "$ARCHIVE_PATH" -C "$TARGET_DIR"

if [[ ! -f "$TARGET_DIR/index.html" ]]; then
  echo "[ERROR] Extracted release does not contain index.html: $TARGET_DIR" >&2
  rm -rf "$TARGET_DIR"
  exit 1
fi

PREVIOUS_TARGET=""
if [[ -L "$APP_DIR/current" ]]; then
  PREVIOUS_TARGET="$(readlink "$APP_DIR/current")"
fi

ln -sfn "$TARGET_DIR" "$APP_DIR/current"

if command -v nginx >/dev/null 2>&1; then
  if [[ -f "$NGINX_CONFIG_PATH" ]]; then
    if ! nginx -t; then
      echo "[ERROR] nginx -t failed, rolling back symlink" >&2
      if [[ -n "$PREVIOUS_TARGET" ]]; then
        ln -sfn "$PREVIOUS_TARGET" "$APP_DIR/current"
      fi
      exit 1
    fi
  else
    echo "[WARN] Nginx config not found at $NGINX_CONFIG_PATH. Skipping strict vhost presence check." >&2
    nginx -t
  fi
fi

if command -v systemctl >/dev/null 2>&1; then
  if ! systemctl reload nginx; then
    echo "[WARN] Failed to reload nginx via systemctl. Verify service state manually." >&2
  fi
fi

echo "[OK] Release deployed: $TARGET_DIR"
echo "[OK] Current symlink: $APP_DIR/current"
