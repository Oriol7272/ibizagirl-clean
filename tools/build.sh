#!/usr/bin/env bash
set -euo pipefail

OUT_DIR=".vercel/output"
STATIC="$OUT_DIR/static"
rm -rf "$OUT_DIR"
mkdir -p "$STATIC/js"

# Output v3 con rutas limpias
cat > "$OUT_DIR/config.json" <<JSON
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

# Copiar el repo al artefacto SIN .git/.vercel/node_modules
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

# Generar env.js con todas las variables (Vercel las inyecta en build)
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

# Sanidad mínima
for f in index.html premium.html; do
  [ -f "$STATIC/$f" ] || { echo "FALTA $f en artefacto"; exit 1; }
done

echo "OK: artefacto v3 en $OUT_DIR"
