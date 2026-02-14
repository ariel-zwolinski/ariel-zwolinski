# Nginx setup notes

Podsumowanie docelowej konfiguracji produkcyjnej dla aplikacji statycznej.

## Ścieżka publikacji

- aktywna wersja: `/var/www/kalkulator/current`
- katalog release'ów: `/var/www/kalkulator/releases`

## Vhost

Repo zawiera gotowy plik:

- `deploy/nginx/kalkulator.conf`

Wymagane parametry:

- `root /var/www/kalkulator/current;`
- `try_files $uri $uri/ /index.html;` dla SPA fallback
- długi cache dla `/assets/`
- brak cache dla `index.html`

## Aktywacja na serwerze

```bash
sudo mkdir -p /var/www/kalkulator/releases
sudo cp deploy/nginx/kalkulator.conf /etc/nginx/sites-available/kalkulator
sudo ln -sfn /etc/nginx/sites-available/kalkulator /etc/nginx/sites-enabled/kalkulator
sudo nginx -t
sudo systemctl reload nginx
```

## Niezbędne pliki do kopiowania

- każdy deploy: `dist.tar.gz`
- jednorazowo: `deploy/nginx/kalkulator.conf`
- opcjonalnie: `scripts/deploy_release.sh` (jeśli deploy ma być wykonywany bez pełnego repo)
