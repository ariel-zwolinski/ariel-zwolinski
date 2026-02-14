#!/usr/bin/env bash
set -euo pipefail

NGINX_CONTAINER_NAME="${NGINX_CONTAINER_NAME:-nginx-web}"
NGINX_IMAGE="${NGINX_IMAGE:-nginx:stable}"
HOST_PORT="${HOST_PORT:-80}"
CONTAINER_PORT="${CONTAINER_PORT:-80}"

if ! command -v docker >/dev/null 2>&1; then
  echo "[ERROR] Docker is not installed. Install Docker first, then rerun this script."
  exit 1
fi

if [[ "${EUID}" -ne 0 ]] && ! groups | grep -q '\bdocker\b'; then
  echo "[INFO] Current user may not have access to Docker daemon."
  echo "[INFO] If needed, run with sudo: sudo bash $0"
fi

echo "[1/4] Pulling image ${NGINX_IMAGE}..."
docker pull "${NGINX_IMAGE}"

echo "[2/4] Removing old container (if exists)..."
if docker ps -a --format '{{.Names}}' | grep -qx "${NGINX_CONTAINER_NAME}"; then
  docker rm -f "${NGINX_CONTAINER_NAME}"
fi

echo "[3/4] Starting nginx container ${NGINX_CONTAINER_NAME} on ${HOST_PORT}:${CONTAINER_PORT}..."
docker run -d \
  --name "${NGINX_CONTAINER_NAME}" \
  --restart unless-stopped \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  "${NGINX_IMAGE}"

echo "[4/4] Verifying container and HTTP response..."
docker ps --filter "name=${NGINX_CONTAINER_NAME}" --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

SERVER_IP="$(hostname -I | awk '{print $1}')"
if [[ -n "${SERVER_IP}" ]]; then
  echo "[INFO] curl -I http://${SERVER_IP}:${HOST_PORT}"
  curl -I "http://${SERVER_IP}:${HOST_PORT}" || true
else
  echo "[WARN] Could not detect server IP. Testing localhost..."
  curl -I "http://localhost:${HOST_PORT}" || true
fi

echo "[DONE] Nginx is running in Docker (if commands above succeeded)."
