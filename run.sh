#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Building and starting the app..."
docker compose up --build -d

echo "Waiting for the backend to be ready..."
HEALTH_URL="http://localhost:8000/api/v1/health"
MAX_ATTEMPTS=60
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  if STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>/dev/null); then
    if [ "$STATUS" = "204" ]; then
      echo "Backend health check passed (HTTP 204)."
      echo "App is running at http://localhost:3000"
      exit 0
    fi
  fi
  ATTEMPT=$((ATTEMPT + 1))
  sleep 2
done

echo "Backend did not become ready in time. Check logs with: docker compose logs backend"
exit 1
