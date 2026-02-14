#!/usr/bin/env bash
set -euo pipefail

DIST_DIR="${1:-dist}"
ARCHIVE_NAME="${2:-dist.tar.gz}"

if [[ ! -d "$DIST_DIR" ]]; then
  echo "Błąd: brak katalogu '$DIST_DIR'. Najpierw uruchom: npm install && npm run build" >&2
  exit 1
fi

if [[ -z "$(find "$DIST_DIR" -mindepth 1 -print -quit)" ]]; then
  echo "Błąd: katalog '$DIST_DIR' jest pusty. Build nie wygenerował artefaktów." >&2
  exit 1
fi

if [[ ! -f "$DIST_DIR/index.html" ]]; then
  echo "Błąd: brak pliku '$DIST_DIR/index.html'. To nie wygląda na poprawny build Vite." >&2
  exit 1
fi

rm -f "$ARCHIVE_NAME"
tar -czf "$ARCHIVE_NAME" -C "$DIST_DIR" .

echo "OK: utworzono paczkę '$ARCHIVE_NAME' z zawartości '$DIST_DIR'."
