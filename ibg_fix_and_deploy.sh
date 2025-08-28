#!/usr/bin/env bash
set -euo pipefail
set +H 2>/dev/null || true   # zsh: desactiva history expansion para evitar "event not found"

echo "== 0) Comprobaciones =="
[[ -f package.json ]] || { echo "✗ No estoy en la raíz del repo"; exit 1; }
[[ -f premium.html ]]  || { echo "✗ Falta premium.html en raíz"; exit 1; }

echo "== 1) Vercel pull (PROD) =="
vercel pull --yes --environment=production >/dev/null || true

ENV_FILE=".vercel/.env.production.local"
[[ -s "$ENV_FILE" ]] || { echo "✗ No se generó $ENV_FILE"; exit 1; }

# helper para leer variables del .env (soporta BSD awk)
read_var() {
  local key="$1"
  awk -F'=' -v k="$key" '$1==k {sub($1"=",""); gsub(/\r$/,""); print; exit}' "$ENV_FILE"
}

echo "== 2) Generar js/env-inline.js con NOMBRES EXACTOS =="
mkdir -p js
cat > js/env-inline.js <<'EOF'
/* AUTO-GENERADO. NO EDITAR. */
;(function(){
  window.IBG_ENV = window.IBG_ENV || {};
EOF

# Lista EXACTA (incluye tu corrección: PACK5_VIDEOS sin 'S')
KEYS=(
  PAYPAL_CLIENT_ID
  PAYPAL_SECRET
  PAYPAL_WEBHOOK_ID
  PAYPAL_PLAN_MONTHLY_1499
  PAYPAL_PLAN_ANNUAL_4999
  PAYPAL_ONESHOT_PRICE_EUR_LIFETIME
  PAYPAL_ONESHOT_PRICE_EUR_VIDEO
  PAYPAL_ONESHOT_PRICE_EUR_IMAGE
  PAYPAL_ONESHOT_PACK10_IMAGES_EUR
  PAYPAL_ONESHOT_PACK5_VIDEOS_EUR
  IBG_ASSETS_BASE_URL
  EXOCLICK_ZONE
  JUICYADS_ZONE
  EROADVERTISING_ZONE
  JUICYADS_SNIPPET_B64
  EROADVERTISING_SNIPPET_B64
  POPADS_ENABLE
  POPADS_SITE_ID
  CRISP_WEBSITE_ID
)

for k in "${KEYS[@]}"; do
  v="$(read_var "$k" || true)"
  v_esc="${v//\\/\\\\}"; v_esc="${v_esc//\"/\\\"}"
  printf '  window.IBG_ENV["%s"] = "%s";\n' "$k" "$v_esc" >> js/env-inline.js
done

cat >> js/env-inline.js <<'EOF'
  console.log("[env-inline] OK ->", Object.keys(window.IBG_ENV));
})();
EOF

echo "== 3) Inyectar /js/env-inline.js (premium.html, index.html) =="
sed_i() {
  # sed -i compatible BSD/GNU
  if sed -i'' -e '' </dev/null 2>/dev/null; then
    sed -i'' -e "$@"
  else
    sed -i -e "$@"
  fi
}
for html in premium.html index.html; do
  if [[ -f "$html" ]] && ! grep -q 'js/env-inline.js' "$html"; then
    sed_i $'s#</body>#  <script src="/js/env-inline.js"></script>\n</body>#' "$html"
    echo "· Inyectado en $html"
  fi
done

echo "== 4) Fix PayPal mark (evitar 404 de /https://www.paypalobjects.com/webstatic/icon/pp258.png) =="
# Reemplaza cualquier referencia a https://www.paypalobjects.com/webstatic/icon/pp258.png por el CDN oficial
PAYPAL_MARK='https://www.paypalobjects.com/webstatic/icon/pp258.png'
grep -RIl --exclude-dir=.vercel --exclude-dir=.git 'https://www.paypalobjects.com/webstatic/icon/pp258.png' js 2>/dev/null | while read -r f; do
  sed_i "s#paypal-mark\.svg#$PAYPAL_MARK#g" "$f"
  echo "· Arreglado en $f"
done

echo "== 5) CSS: anuncios sólo laterales (ocultar en grid) =="
mkdir -p css
cat > css/ads-laterales.css <<'EOF'
/* Fuerza ads sólo a laterales; oculta en grids/listas */
#thumbs .ad, #thumbs .ad-slot, #grid .ad, #grid .ad-slot,
.gallery .ad, .gallery .ad-slot, .masonry .ad, .masonry .ad-slot {
  display: none !important;
}
#ad-left, #ad-right {
  position: fixed;
  top: 110px;
  width: 160px;
  z-index: 50;
}
#ad-left  { left: 10px; }
#ad-right { right: 10px; }
@media (max-width: 1200px){
  #ad-left, #ad-right { display:none !important; }
}
EOF

# enlazar CSS si no está
for html in premium.html index.html; do
  if [[ -f "$html" ]] && ! grep -q 'css/ads-laterales.css' "$html"; then
    sed_i $'s#</head>#  <link rel="stylesheet" href="/css/ads-laterales.css">\n</head>#' "$html"
    echo "· CSS ads laterales enlazado en $html"
  fi
done

echo "== 6) Auditoría de assets (detecta 404 de verdad) =="
missing=0
check_dir() {
  local dir="$1"; shift
  if [[ ! -d "$dir" ]]; then
    echo "⚠ Carpeta $dir no existe en el repo (si sirves desde CDN, ajusta IBG_ASSETS_BASE_URL)."
    return
  fi
  while IFS= read -r rel; do
    [[ -z "$rel" ]] && continue
    if [[ ! -f "$dir/$rel" ]]; then
      echo "✗ Falta: $dir/$rel"
      missing=1
    fi
  done < <(grep -Eo '["'\'']([A-Za-z0-9._/-]+\.(jpg|jpeg|png|webp))["'\'']' content-data2.js content-data3.js content-data4.js \
           | sed -E 's/^["'\'']|["'\'']$//g' \
           | grep -E '^(full/|uncensored/|decorative-images/)' \
           | sed -E 's#^(full/|uncensored/|decorative-images/)##' \
           | sort -u)
}

# Revisamos por carpeta (coincidiendo con tus content-data*)
check_dir "full"
check_dir "uncensored"
check_dir "decorative-images"

if (( missing )); then
  echo "────────────────────────────────────────"
  echo "🛑 Hay ficheros referenciados en content-data*.js que NO existen en el proyecto."
  echo "   → Sube los archivos faltantes o corrige los nombres/extensiones en content-data*.js."
fi

echo "== 7) Commit =="
git add js css premium.html index.html 2>/dev/null || true
git commit -m "fix: env-inline + PayPal mark CDN + ads sólo laterales + auditoría" >/dev/null || echo "· Nada que commitear"

echo "== 8) Build + Deploy (PROD) =="
vercel build --prod >/dev/null
RAW="$(vercel deploy --prebuilt --prod --yes 2>&1 | tee /dev/stderr || true)"

# Captura simple de la línea 'Production: https://*.vercel.app'
DEPLOY_URL="$(printf "%s\n" "$RAW" | grep -Eo 'https://[A-Za-z0-9._-]+\.vercel\.app' | tail -n1 || true)"
if [[ -n "${DEPLOY_URL:-}" ]]; then
  echo "✅ Production: $DEPLOY_URL"
  printf "HEAD %s -> " "$DEPLOY_URL/premium"; curl -sI "$DEPLOY_URL/premium" | head -n1
else
  echo "⚠ No pude extraer DEPLOY_URL; revisa la salida de deploy arriba."
fi

echo "== FIN =="
