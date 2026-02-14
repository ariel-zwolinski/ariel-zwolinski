# Kalkulator podatkowy (React + Vite) — build i deploy na Nginx

Ten projekt jest **statycznym frontendem**. Na serwer produkcyjny z Nginx wrzucasz wyłącznie artefakt builda (`dist/` albo `dist.tar.gz`), bez `node_modules` i bez kodu źródłowego.

## 1) Build lokalnie

```bash
npm install
npm run test
npm run build
bash scripts/release.sh
```

Po tych komendach masz:
- `dist/` — gotowe pliki statyczne,
- `dist.tar.gz` — paczka do szybkiego uploadu.

> Uwaga: repo nie zawiera lockfile, więc używamy `npm install` (nie `npm ci`).

---

## 2) Co kopiować na serwer

Masz dwa poprawne warianty:

- **zalecany:** kopiujesz tylko `dist.tar.gz`,
- alternatywa: kopiujesz katalog `dist/`.

### Upload paczki

```bash
scp dist.tar.gz user@server:/tmp/dist.tar.gz
```

---

## 3) Minimalna struktura na serwerze

```text
/var/www/kalkulator/
  releases/
    2026-02-14_120001/
    2026-02-14_131530/
  current -> /var/www/kalkulator/releases/2026-02-14_131530
```

Każdy deploy tworzy nowy katalog release, a `current` jest symlinkiem na aktywną wersję.

---

## 4) Deploy release na serwerze

Skrypt znajduje się w repo: `scripts/deploy_release.sh`.

```bash
sudo APP_DIR=/var/www/kalkulator bash scripts/deploy_release.sh /tmp/dist.tar.gz
```

Skrypt:
1. rozpakowuje paczkę do `releases/<timestamp>`,
2. przełącza symlink `current`,
3. sprawdza config Nginx (`nginx -t`, jeśli nginx jest dostępny),
4. próbuje `systemctl reload nginx` (jeśli jest systemd).

---

## 5) Konfiguracja Nginx

Gotowy plik vhosta jest w repo: `deploy/nginx/kalkulator.conf`.

Na serwerze:

```bash
sudo cp deploy/nginx/kalkulator.conf /etc/nginx/sites-available/kalkulator
sudo ln -sfn /etc/nginx/sites-available/kalkulator /etc/nginx/sites-enabled/kalkulator
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6) Rollback

Sprawdź dostępne wersje:

```bash
ls -1 /var/www/kalkulator/releases
```

Przełącz `current` na poprzedni release:

```bash
sudo ln -sfn /var/www/kalkulator/releases/<release_id> /var/www/kalkulator/current
sudo systemctl reload nginx
```
