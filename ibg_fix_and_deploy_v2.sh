#!/usr/bin/env bash
set -euo pipefail

echo "== 0) Comprobaciones =="
[[ -f package.json ]] || { echo "✗ No estoy en la raíz del repo"; exit 1; }
[[ -f premium.html ]]  || { echo "✗ Falta premium.html en raíz"; exit 1; }

echo "== 1) Vercel pull (PROD) =="
vercel pull --yes --environment=production >/dev/null || true
ENV_FILE=".vercel/.env.production.local"
[[ -s "$ENV_FILE" ]] || { echo "✗ No se generó $ENV_FILE"; exit 1; }

read_var() { awk -F'=' -v k="$1" '$1==k {sub($1"=",""); gsub(/\r$/,""); print; exit}' "$ENV_FILE"; }

# sed -i compatible
sed_i() { if sed -i'' -e '' </dev/null 2>/dev/null; then sed -i'' -e "$@"; else sed -i -e "$@"; fi; }

echo "== 2) Generar js/env-inline.js (claves exactas) =="
mkdir -p js
cat > js/env-inline.js <<'EOF'
/* AUTO-GENERADO. NO EDITAR. */
;(function(){ window.IBG_ENV = window.IBG_ENV || {};
EOF
KEYS=(
  PAYPAL_CLIENT_ID PAYPAL_SECRET PAYPAL_WEBHOOK_ID
  PAYPAL_PLAN_MONTHLY_1499 PAYPAL_PLAN_ANNUAL_4999
  PAYPAL_ONESHOT_PRICE_EUR_LIFETIME PAYPAL_ONESHOT_PRICE_EUR_VIDEO PAYPAL_ONESHOT_PRICE_EUR_IMAGE
  PAYPAL_ONESHOT_PACK10_IMAGES_EUR PAYPAL_ONESHOT_PACK5_VIDEOS_EUR
  IBG_ASSETS_BASE_URL EXOCLICK_ZONE JUICYADS_ZONE EROADVERTISING_ZONE
  JUICYADS_SNIPPET_B64 EROADVERTISING_SNIPPET_B64 POPADS_ENABLE POPADS_SITE_ID CRISP_WEBSITE_ID
)
for k in "${KEYS[@]}"; do
  v="$(read_var "$k" || true)"; v="${v//\\/\\\\}"; v="${v//\"/\\\"}"
  printf 'window.IBG_ENV["%s"]="%s";\n' "$k" "$v" >> js/env-inline.js
done
cat >> js/env-inline.js <<'EOF'
console.log("[env-inline] OK ->", Object.keys(window.IBG_ENV));
})();
EOF

echo "== 3) Inyectar /js/env-inline.js (premium.html, index.html) =="
for html in premium.html index.html; do
  if [[ -f "$html" ]] && ! grep -q 'js/env-inline.js' "$html"; then
    awk 'BEGIN{add=0}
         /<\/body>/ && !add { print "  <script src=\"/js/env-inline.js\"></script>"; add=1 }
         { print }' "$html" > "$html.tmp" && mv "$html.tmp" "$html"
    echo "· Inyectado en $html"
  fi
done

echo "== 4) Fix de paypal-mark.svg sólo en HTML/CSS/JS (no scripts) =="
PAYPAL_MARK='https://www.paypalobjects.com/webstatic/icon/pp258.png'
# Sólo *.html *.css *.js (excluye carpeta scripts y el propio .sh)
find . -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' \) \
  -not -path './scripts/*' -not -name 'ibg_fix_and_deploy_v2.sh' \
  -print0 | xargs -0 grep -Il 'paypal-mark\.svg' | while read -r f; do
    sed_i "s#paypal-mark\.svg#$PAYPAL_MARK#g" "$f"
    echo "· Reemplazado en $f"
  done

echo "== 5) CSS: anuncios sólo laterales (inyección sin sed newlines) =="
mkdir -p css
cat > css/ads-laterales.css <<'EOF'
#thumbs .ad, #thumbs .ad-slot, #grid .ad, #grid .ad-slot,
.gallery .ad, .gallery .ad-slot, .masonry .ad, .masonry .ad-slot { display:none!important; }
#ad-left, #ad-right { position:fixed; top:110px; width:160px; z-index:50; }
#ad-left{left:10px} #ad-right{right:10px}
@media (max-width:1200px){ #ad-left,#ad-right{display:none!important} }
EOF
for html in premium.html index.html; do
  if [[ -f "$html" ]] && ! grep -q 'css/ads-laterales.css' "$html"; then
    awk 'BEGIN{add=0}
         /<\/head>/ && !add { print "  <link rel=\"stylesheet\" href=\"/css/ads-laterales.css\">"; add=1 }
         { print }' "$html" > "$html.tmp" && mv "$html.tmp" "$html"
    echo "· CSS ads laterales enlazado en $html"
  fi
done

echo "== 6) Corrección de imágenes (extensiones alternativas) =="
mapfile -t PATHS < <(grep -Eo '["'\''](full|uncensored|decorative-images)/[A-Za-z0-9._/-]+\.(jpg|jpeg|png|webp)["'\'']' \
  content-data2.js content-data3.js content-data4.js | sed -E 's/^["'\'']|["'\'']$//g' | sort -u)

exists(){ [[ -f "$1" ]]; }
find_alt(){
  local p="$1"; local dir="${p%%/*}"; local rest="${p#*/}"; local base="${rest%.*}"
  for ext in jpg jpeg png webp JPG JPEG PNG WEBP; do
    [[ -f "$dir/$base.$ext" ]] && { echo "$dir/$base.$ext"; return 0; }
  done; return 1
}

missing=0; fixed=0
for p in "${PATHS[@]}"; do
  exists "$p" && continue
  if alt="$(find_alt "$p")"; then
    for f in content-data2.js content-data3.js content-data4.js; do
      sed_i "s#${p//\./\\.}#${alt//\./\\.}#g" "$f"
    done
    echo "· Ext corregida: $p -> $alt"; ((fixed++))||true
  else
    echo "✗ Falta archivo: $p"; ((missing++))||true
  fi
done
((missing)) && echo "⚠ Quedan $missing referencias sin archivo; súbelas o elimínalas."

echo "== 7) Commit =="
git add js css premium.html index.html content-data2.js content-data3.js content-data4.js >/dev/null 2>&1 || true
git commit -m "fix: env-inline; paypal-mark CDN; anuncios laterales; corregir assets en content-data*" >/dev/null || echo "· Nada que commitear"

echo "== 8) Build + Deploy (PROD) =="
vercel build --prod >/dev/null
RAW="$(vercel deploy --prebuilt --prod --yes 2>&1 | tee /dev/stderr || true)"
URL="$(printf "%s\n" "$RAW" | grep -Eo 'https://[A-Za-z0-9._-]+\.vercel\.app' | tail -n1 || true)"
if [[ -n "${URL:-}" ]]; then
  echo "✅ Production: $URL"
  printf "HEAD %s -> " "$URL/premium"; curl -sI "$URL/premium" | head -n1
else
  echo "⚠ No pude extraer la URL de producción (mira la salida anterior)."
fi
echo "== FIN =="
