#!/bin/bash

set -e

echo "=== Pull latest Product API image ==="

docker compose \
  --env-file .env.prod \
  -f docker-compose-prod.yaml \
  pull product-api

echo "=== Restart Product API ==="

docker compose \
  --env-file .env.prod \
  -f docker-compose-prod.yaml \
  up -d

echo "=== Check containers ==="

docker compose \
  --env-file .env.prod \
  -f docker-compose-prod.yaml \
  ps

echo "=== Deployment completed ==="