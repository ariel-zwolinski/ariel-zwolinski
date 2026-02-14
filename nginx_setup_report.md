# Nginx setup notes

Ten plik podsumowuje docelową konfigurację produkcyjną dla aplikacji statycznej.

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
sudo cp deploy/nginx/kalkulator.conf /etc/nginx/sites-available/kalkulator
sudo ln -sfn /etc/nginx/sites-available/kalkulator /etc/nginx/sites-enabled/kalkulator
sudo nginx -t
sudo systemctl reload nginx
```
