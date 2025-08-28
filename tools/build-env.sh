#!/usr/bin/env bash
set -euo pipefail
mkdir -p js
# Generar env.js con EXACTAS variables existentes en Vercel (ibg-report.txt)
cat > js/env.js <<'EOT'
window.ENV = {
  CRISP_WEBSITE_ID: "${CRISP_WEBSITE_ID:-}",
  EROADVERTISING_SNIPPET_B64: "${EROADVERTISING_SNIPPET_B64:-}",
  EROADVERTISING_ZONE: "${EROADVERTISING_ZONE:-}",
  EXOCLICK_ZONE: "${EXOCLICK_ZONE:-}",
  IBG_ASSETS_BASE_URL: "${IBG_ASSETS_BASE_URL:-}",
  JUICYADS_SNIPPET_B64: "${JUICYADS_SNIPPET_B64:-}",
  JUICYADS_ZONE: "${JUICYADS_ZONE:-}",
  PAYPAL_CLIENT_ID: "${PAYPAL_CLIENT_ID:-}",
  PAYPAL_ONESHOT_PACK10_IMAGES_EUR: "${PAYPAL_ONESHOT_PACK10_IMAGES_EUR:-}",
  PAYPAL_ONESHOT_PACK5_VIDEOS_EUR: "${PAYPAL_ONESHOT_PACK5_VIDEOS_EUR:-}",
  PAYPAL_ONESHOT_PRICE_EUR_IMAGE: "${PAYPAL_ONESHOT_PRICE_EUR_IMAGE:-}",
  PAYPAL_ONESHOT_PRICE_EUR_LIFETIME: "${PAYPAL_ONESHOT_PRICE_EUR_LIFETIME:-}",
  PAYPAL_ONESHOT_PRICE_EUR_VIDEO: "${PAYPAL_ONESHOT_PRICE_EUR_VIDEO:-}",
  PAYPAL_PLAN_ANNUAL_4999: "${PAYPAL_PLAN_ANNUAL_4999:-}",
  PAYPAL_PLAN_MONTHLY_1499: "${PAYPAL_PLAN_MONTHLY_1499:-}",
  PAYPAL_SECRET: "${PAYPAL_SECRET:-}",
  PAYPAL_WEBHOOK_ID: "${PAYPAL_WEBHOOK_ID:-}",
  POPADS_ENABLE: "${POPADS_ENABLE:-}",
  POPADS_SITE_ID: "${POPADS_SITE_ID:-}",
  ADS: { left: "${IBG_ADS_LEFT:-}", right: "${IBG_ADS_RIGHT:-}" },
  BANNER: { images: [${IBG_BANNER_IMAGES:-}] }
};
EOT

# Manifest del banner: escanea /decorative-images/*.(jpg|jpeg|png|webp|gif)
jqbin="$(command -v jq || true)"
tmpjson="$(mktemp)"
: > "$tmpjson"
if ls decorative-images/* >/dev/null 2>&1; then
  if command -v python3 >/dev/null 2>&1; then
    python3 - "$PWD" <<'PY'
import os, json, sys, glob
ex=("*.jpg","*.jpeg","*.png","*.webp","*.gif")
files=[]
for pat in ex:
  files+=glob.glob(os.path.join("decorative-images", pat))
files=[f.replace("\\","/") for f in files]
print(json.dumps(files, ensure_ascii=False))
PY
  else
    echo "[]" 
  fi > decorative-images.json
else
  echo "[]" > decorative-images.json
fi
echo "OK"
