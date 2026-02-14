# Nginx setup (Docker only)

Zgodnie z wymaganiem, konfiguracja została uproszczona do jednej ścieżki: **Nginx w Dockerze**.
Wersja natywna (apt/systemctl/ufw) została usunięta jako redundantna.

## Uruchomienie

```bash
chmod +x run_nginx_docker.sh
./run_nginx_docker.sh
```

## Co robi skrypt

1. Sprawdza, czy `docker` jest dostępny.
2. Pobiera obraz `nginx:stable` (lub z `NGINX_IMAGE`).
3. Usuwa poprzedni kontener o tej samej nazwie (domyślnie `nginx-web`), jeśli istnieje.
4. Uruchamia nowy kontener z mapowaniem portów (domyślnie `80:80`) i polityką restartu `unless-stopped`.
5. Weryfikuje działanie przez `docker ps` i `curl -I`.

## Zmienne opcjonalne

- `NGINX_CONTAINER_NAME` (domyślnie: `nginx-web`)
- `NGINX_IMAGE` (domyślnie: `nginx:stable`)
- `HOST_PORT` (domyślnie: `80`)
- `CONTAINER_PORT` (domyślnie: `80`)
