#!/usr/bin/env bash
set -euo pipefail

OUT=".vercel/output"
STATIC="$OUT/static"

# Cargar env de prod si existe localmente (para generar js/env.js)
if [ -f ".vercel/.env.production.local" ]; then
  set -a
  . .vercel/.env.production.local
  set +a
fi

rm -rf "$OUT"
mkdir -p "$STATIC/js"

# Config Output v3 y rutas limpias
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

# Copiar TODO al artefacto (sin carpetas internas)
rsync -a --delete \
  --exclude ".git" --exclude ".vercel" --exclude "node_modules" \
  ./ "$STATIC/"

# env.js para frontend
cat > "$STATIC/js/env.js" <<JS
window.ENV = {
  PAYPAL_CLIENT_ID: "${PAYPAL_CLIENT_ID:-}",
  PAYPAL_PLAN_MONTHLY_1499: "${PAYPAL_PLAN_MONTHLY_1499:-}",
  PAYPAL_PLAN_ANNUAL_4999: "${PAYPAL_PLAN_ANNUAL_4999:-}",
  PAYPAL_ONESHOT_PRICE_EUR: "${PAYPAL_ONESHOT_PRICE_EUR:-3.00}",
  EXOCLICK_ZONE: "${EXOCLICK_ZONE:-}",
  JUICYADS_ZONE: "${JUICYADS_ZONE:-}",
  EROADVERTISING_ZONE: "${EROADVERTISING_ZONE:-}",
  POPADS_SITE_ID: "${POPADS_SITE_ID:-}",
  CRISP_WEBSITE_ID: "${CRISP_WEBSITE_ID:-}",
  IBG_ASSETS_BASE_URL: "${IBG_ASSETS_BASE_URL:-}"
};
JS

# Sanidad para evitar 404
[ -f "$STATIC/index.html" ]   || { echo "FALTA index.html en $STATIC"; exit 1; }
[ -f "$STATIC/premium.html" ] || { echo "FALTA premium.html en $STATIC"; exit 1; }

echo "OK: artefacto v3 listo en $OUT"
