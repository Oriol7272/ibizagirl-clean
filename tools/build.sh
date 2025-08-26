set -e
OUT=".vercel/output/static"
mkdir -p "$OUT/js"

# Copia TODO menos .git y node_modules
rsync -a --delete \
  --exclude '.git' \
  --exclude '.vercel' \
  --exclude 'node_modules' \
  ./ "$OUT/"

# Genera env.js con todas las vars
cat > "$OUT/js/env.js" <<EOT
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
EOT
