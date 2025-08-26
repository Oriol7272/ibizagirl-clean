#!/usr/bin/env bash
set -euo pipefail

OUT=".vercel/output"
STATIC="$OUT/static"

# Cargar env local (para generar js/env.js si existe)
if [ -f ".vercel/.env.production.local" ]; then
  set -a
  . .vercel/.env.production.local
  set +a
fi

# Estructura v3
rm -rf "$OUT"
mkdir -p "$STATIC/js"

# Config Output v3 con rutas limpias
cat > "$OUT/config.json" <<JSON
{
  "version": 3,
  "routes": [
    { "handle": "filesystem" },
    { "src": "^/premium/?$",      "dest": "/premium.html" },
    { "src": "^/subscription/?$", "dest": "/subscription.html" },
    { "src": "^/videos/?$",       "dest": "/videos.html" }
  ]
}
JSON

# Copiar TODO salvo .git/.vercel/node_modules
if command -v tar >/dev/null 2>&1; then
  tar --exclude="./.git" --exclude="./.vercel" --exclude="./node_modules" \
      -cf - . | ( cd "$STATIC" && tar -xf - )
else
  shopt -s dotglob || true
  for entry in * ; do
    case "$entry" in .git|.vercel|node_modules) continue;; esac
    cp -a "$entry" "$STATIC"/
  done
fi

# Generar env.js con nuevos precios
cat > "$STATIC/js/env.js" <<JS
window.ENV = {
  PAYPAL_CLIENT_ID: "${PAYPAL_CLIENT_ID:-}",
  PAYPAL_PLAN_MONTHLY_1499: "${PAYPAL_PLAN_MONTHLY_1499:-}",
  PAYPAL_PLAN_ANNUAL_4999: "${PAYPAL_PLAN_ANNUAL_4999:-}",
  PAYPAL_ONESHOT_PRICE_EUR_IMAGE: "${PAYPAL_ONESHOT_PRICE_EUR_IMAGE:-0.10}",
  PAYPAL_ONESHOT_PRICE_EUR_VIDEO: "${PAYPAL_ONESHOT_PRICE_EUR_VIDEO:-0.30}",
  PAYPAL_ONESHOT_PRICE_EUR_LIFETIME: "${PAYPAL_ONESHOT_PRICE_EUR_LIFETIME:-100.00}",
  EXOCLICK_ZONE: "${EXOCLICK_ZONE:-}",
  JUICYADS_ZONE: "${JUICYADS_ZONE:-}",
  EROADVERTISING_ZONE: "${EROADVERTISING_ZONE:-}",
  POPADS_SITE_ID: "${POPADS_SITE_ID:-}",
  CRISP_WEBSITE_ID: "${CRISP_WEBSITE_ID:-}",
  IBG_ASSETS_BASE_URL: "${IBG_ASSETS_BASE_URL:-}"
};
JS

# Sanidad
[ -f "$STATIC/index.html" ]   || { echo "FALTA index.html en $STATIC"; exit 1; }
[ -f "$STATIC/premium.html" ] || { echo "FALTA premium.html en $STATIC"; exit 1; }

echo "OK: artefacto v3 listo en $OUT"
