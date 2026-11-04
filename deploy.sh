#!/usr/bin/env bash
# Build the app and publish the production files to the gh-pages branch.
# Usage: ./deploy.sh
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_DIR"

echo "==> Installing dependencies (if needed)"
npm install

echo "==> Building production site"
npm run build

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

cp -r dist/. "$TMP_DIR"/
touch "$TMP_DIR/.nojekyll"

cd "$TMP_DIR"
git init -q
git checkout -q -b gh-pages
git add -A

NAME="$(git -C "$REPO_DIR" config user.name || true)"
EMAIL="$(git -C "$REPO_DIR" config user.email || true)"
git -c user.name="${NAME:-Oleksandr}" -c user.email="${EMAIL:-oleksandrkobrinskij@gmail.com}" \
  commit -q -m "deploy: publish production build"

REMOTE="$(git -C "$REPO_DIR" remote get-url origin)"
git remote add origin "$REMOTE"
git push -f origin gh-pages

echo "==> Done. The gh-pages branch has been updated."
echo "    Site: https://oleksandr2903.github.io/AlghoritmTrainer_V2/"
