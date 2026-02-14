# Kalkulator — release, deploy i rollback

Poniżej jest prosty i powtarzalny proces dla statycznego frontendu.

## Flow release (dokładnie)

```bash
npm ci
npm run build
bash scripts/release.sh
```

1. `npm ci` — instaluje zależności w wersjach z lockfile.
2. `npm run build` — buduje aplikację do katalogu `dist/`.
3. `bash scripts/release.sh` — pakuje zawartość `dist/` do `dist.tar.gz`.

> Wymagany artefakt po buildzie: katalog `dist/`.

---

## Upload artefaktu

Masz 2 poprawne warianty uploadu:

- **wariant A (zalecany):** upload `dist.tar.gz` (mniej plików, szybszy transfer),
- **wariant B:** upload całego katalogu `dist/`.

### Wariant A — upload `dist.tar.gz`

```bash
scp dist.tar.gz user@server:/tmp/dist.tar.gz
```

### Wariant B — upload `dist/`

```bash
scp -r dist user@server:/tmp/dist
```

---

## Docelowa struktura na serwerze

```text
/var/www/kalkulator/
  releases/
    2026-02-14_120001/
    2026-02-14_131530/
  current -> /var/www/kalkulator/releases/2026-02-14_131530
```

Zasada:
- każdy deploy ląduje w nowym katalogu `releases/<release_id>`,
- `current` to symlink do aktywnej wersji,
- webserver (np. Nginx) wskazuje root na `/var/www/kalkulator/current`.

---

## Deploy na serwer (wariant z paczką `dist.tar.gz`)

```bash
set -euo pipefail

APP_DIR="/var/www/kalkulator"
RELEASES_DIR="$APP_DIR/releases"
RELEASE_ID="$(date +%F_%H%M%S)"
TARGET_DIR="$RELEASES_DIR/$RELEASE_ID"

mkdir -p "$TARGET_DIR"
tar -xzf /tmp/dist.tar.gz -C "$TARGET_DIR"
ln -sfn "$TARGET_DIR" "$APP_DIR/current"
```

## Deploy na serwer (wariant z uploadowanym katalogiem `dist/`)

```bash
set -euo pipefail

APP_DIR="/var/www/kalkulator"
RELEASES_DIR="$APP_DIR/releases"
RELEASE_ID="$(date +%F_%H%M%S)"
TARGET_DIR="$RELEASES_DIR/$RELEASE_ID"

mkdir -p "$TARGET_DIR"
cp -a /tmp/dist/. "$TARGET_DIR/"
ln -sfn "$TARGET_DIR" "$APP_DIR/current"
```

---

## Rollback (przełączenie symlinka na poprzedni release)

1. Sprawdź dostępne wersje:

```bash
ls -1 /var/www/kalkulator/releases
```

2. Przełącz `current` na wybrany (poprzedni) release:

```bash
ln -sfn /var/www/kalkulator/releases/2026-02-14_120001 /var/www/kalkulator/current
```

Po wykonaniu komendy rollback jest natychmiastowy, bo webserver czyta pliki przez symlink `current`.
