#!/usr/bin/env bash
set -euo pipefail

echo "== Vercel static Output build =="
mkdir -p .vercel/output/static

# Copiamos TODO el sitio estático al artefacto (sin .git, sin .vercel de la raíz, sin node_modules, sin la propia carpeta tools)
rsync -a --delete \
  --exclude '.git' \
  --exclude '.vercel' \
  --exclude 'node_modules' \
  --exclude 'tools' \
  ./ .vercel/output/static/

# Sanity check
[ -f ".vercel/output/static/index.html" ] || { echo "Falta index.html en el artefacto"; exit 1; }

echo "== OK: artefacto estático en .vercel/output/static"
