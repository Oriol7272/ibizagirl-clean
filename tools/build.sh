#!/usr/bin/env bash
set -euo pipefail
mkdir -p .vercel/output/static
rsync -a --delete \
  --exclude '.git' \
  --exclude '.vercel' \
  --exclude 'node_modules' \
  --exclude 'tools' \
  ./ .vercel/output/static/
[ -f ".vercel/output/static/index.html" ] || { echo "Falta index.html en el artefacto"; exit 1; }
