#!/bin/sh
set -e

# Ensure uploads folder exists and is writable
# mkdir -p /opt/app/public/uploads
# chown -R node:node /opt/app/public/uploads || true
# chmod -R 755 /opt/app/public/uploads || true

# export MINIO_ACCESS_KEY=$(cat /run/secrets/minio_strapi_uploads_access_key)
# export MINIO_SECRET_KEY=$(cat /run/secrets/minio_strapi_uploads_secret_key)

# Execute the main CMD
exec "$@"
