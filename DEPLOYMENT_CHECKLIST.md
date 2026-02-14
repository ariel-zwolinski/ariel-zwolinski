# Deployment checklist (Nginx)

## Pre-deploy (lokalnie)

- [ ] `npm install`
- [ ] `npm run release`
- [ ] Istnieje plik `dist.tar.gz`

## Pierwsza konfiguracja serwera

- [ ] Katalog aplikacji istnieje: `/var/www/kalkulator/releases`
- [ ] Vhost skopiowany: `deploy/nginx/kalkulator.conf` -> `/etc/nginx/sites-available/kalkulator`
- [ ] Symlink aktywny: `/etc/nginx/sites-enabled/kalkulator`
- [ ] `nginx -t` przechodzi bez błędów

## Deploy release

- [ ] Upload artefaktu: `scp dist.tar.gz user@server:/tmp/dist.tar.gz`
- [ ] Deploy wykonany: `APP_DIR=/var/www/kalkulator bash scripts/deploy_release.sh /tmp/dist.tar.gz`
- [ ] `current` wskazuje nowy release
- [ ] Strona odpowiada HTTP 200 i ładuje assety

## Rollback readiness

- [ ] W `releases/` istnieje co najmniej jedna poprzednia wersja
- [ ] Przetestowana komenda rollbacku przez zmianę symlinka `current`
