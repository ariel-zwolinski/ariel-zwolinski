# Raport konfiguracji Nginx dla aplikacji kalkulator

Wykonano konfigurację wdrożeniową zgodnie z wymaganiami dla ścieżki `/var/www/kalkulator/current`.

## 1) Publikacja plików aplikacji

Utworzono katalog docelowy i skopiowano zawartość `dist/`:

```bash
mkdir -p /var/www/kalkulator/current
cp -a /workspace/ariel-zwolinski/dist/. /var/www/kalkulator/current/
```

## 2) Vhost `/etc/nginx/sites-available/kalkulator`

Utworzono plik konfiguracyjny z:

- `root /var/www/kalkulator/current;`
- `index index.html;`
- fallback SPA: `location / { try_files $uri $uri/ /index.html; }`
- długim cache dla assetów (`/assets/`)
- wyłączonym cache dla `index.html`

Treść użytej konfiguracji:

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/kalkulator/current;
    index index.html;

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 3) Aktywacja site

Utworzono symlink:

```bash
ln -sfn /etc/nginx/sites-available/kalkulator /etc/nginx/sites-enabled/kalkulator
```

## 4) Walidacja i reload

W tym środowisku nie było możliwe pełne domknięcie kroku serwisowego:

- `nginx -t` -> `bash: command not found: nginx`
- `systemctl reload nginx` -> brak `systemd` (`PID 1` nie jest systemd)

Na serwerze docelowym (z zainstalowanym nginx i systemd) należy wykonać:

```bash
nginx -t
systemctl reload nginx
```
