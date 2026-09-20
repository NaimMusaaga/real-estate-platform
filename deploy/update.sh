#!/usr/bin/env bash
# Ship a new version to the server: pull, reinstall, rebuild the frontend, reload the API.
#   bash /opt/logai/deploy/update.sh
# (Does not run migrations — schema.sql is not idempotent; apply schema changes by hand.)
set -euo pipefail

cd /opt/logai
git pull --ff-only

cd backend
npm ci --omit=dev

cd ../frontend
npm ci
npm run build

pm2 reload logai-api
echo "Updated."
