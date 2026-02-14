# Kalkulator podatkowy (React + Vite) — produkcyjny deploy na Nginx

Ten projekt jest **statycznym frontendem**. Na serwer produkcyjny kopiujesz wyłącznie artefakt builda (`dist.tar.gz`) oraz (jednorazowo) plik konfiguracji Nginx.

## Szybki start (lokalnie)

```bash
npm install
npm run release
```

To uruchamia testy + typecheck + build, a na końcu tworzy `dist.tar.gz`.

## Co kopiować na serwer

### Każdy deploy
- `dist.tar.gz`

### Tylko przy pierwszej konfiguracji serwera
- `deploy/nginx/kalkulator.conf` (do `/etc/nginx/sites-available/kalkulator`)
- `scripts/deploy_release.sh` (opcjonalnie, jeśli chcesz deployować bez pełnego repo, np. do `/usr/local/bin/kalkulator-deploy`)

---

## Pierwsza konfiguracja serwera

1. Utwórz katalogi aplikacji:

```bash
sudo mkdir -p /var/www/kalkulator/releases
```

2. Wgraj konfigurację Nginx i aktywuj:

```bash
sudo cp deploy/nginx/kalkulator.conf /etc/nginx/sites-available/kalkulator
sudo ln -sfn /etc/nginx/sites-available/kalkulator /etc/nginx/sites-enabled/kalkulator
sudo nginx -t
sudo systemctl reload nginx
```

---

## Deploy release na serwerze

1. Upload paczki:

```bash
scp dist.tar.gz user@server:/tmp/dist.tar.gz
```

2. Deploy (na serwerze):

```bash
sudo APP_DIR=/var/www/kalkulator bash scripts/deploy_release.sh /tmp/dist.tar.gz
```

> Jeśli skopiowałeś skrypt do `/usr/local/bin/kalkulator-deploy`, możesz wywołać:
>
> `sudo APP_DIR=/var/www/kalkulator kalkulator-deploy /tmp/dist.tar.gz`

Skrypt deployujący:
- waliduje archiwum,
- rozpakowuje je do `releases/<timestamp>`,
- przełącza symlink `current`,
- sprawdza `nginx -t`,
- wykonuje `systemctl reload nginx`.

---

## Struktura katalogów na serwerze

```text
/var/www/kalkulator/
  releases/
    2026-02-14_120001/
    2026-02-14_131530/
  current -> /var/www/kalkulator/releases/2026-02-14_131530
```

---

## Rollback

```bash
ls -1 /var/www/kalkulator/releases
sudo ln -sfn /var/www/kalkulator/releases/<release_id> /var/www/kalkulator/current
sudo systemctl reload nginx
```
