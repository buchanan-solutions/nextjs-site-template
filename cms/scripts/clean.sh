#!/bin/bash
# clean.sh - removes .strapi and dist folders from project root

# Exit on any error
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Cleaning .strapi and dist folders in $ROOT_DIR ..."

# Remove .strapi
if [ -d "$ROOT_DIR/.strapi" ]; then
  rm -rf "$ROOT_DIR/.strapi"
  echo "Removed .strapi"
else
  echo ".strapi does not exist, skipping"
fi

# Remove dist
if [ -d "$ROOT_DIR/dist" ]; then
  rm -rf "$ROOT_DIR/dist"
  echo "Removed dist"
else
  echo "dist does not exist, skipping"
fi

echo "Clean complete."
