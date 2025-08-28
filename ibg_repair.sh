#!/bin/sh
# ─────────────────────────────────────────────────────────────
# ibg_repair.sh  —  Reparaciones mínimas + deploy (POSIX/sh)
# - No toca .vercel/output
# - Compatible con zsh (no arrays/mapfile/proc-substitution)
# ─────────────────────────────────────────────────────────────
set -eu

say(){ printf "\n== %s ==\n" "$*"; }

ROOT_OK=0
[ -f "package.json" ] && [ -f "premium.html" ] && ROOT_OK=1
if [ "$ROOT_OK" -ne 1 ]; then
  echo "✗ Ejecuta este script en la RAÍZ del repo (donde está premium.html)."
  exit 1
fi

# sed -i (BSD macOS)
sed_i(){
  # $1 = expresión; $2 = fichero
  sed -i '' -e "$1" "$2"
}

# 1) Traer ENV de producción (Vercel)
say "1) vercel pull (PROD)"
vercel pull --yes --environment=production >/dev/null || true
ENV_FILE=".vercel/.env.production.local"
if [ ! -s "$ENV_FILE" ]; then
  echo "✗ No se generó $ENV_FILE"; exit 1
fi

# 2) Generar js/env-inline.js (JS plano, nombres EXACTOS)
say "2) Generar js/env-inline.js"
mkdir -p js
# función para leer valor por clave (= primera coincidencia exacta)
read_var(){ awk -F'=' -v k="$1" '$1==k {sub($1"=",""); gsub(/\r$/,""); print; exit}' "$ENV_FILE"; }

# Lista de claves EXACTAS (según tu repo/capturas)
cat > .ibg_keys.txt <<EOF
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
EOF

# Escapa \ y " para JS
escape_js(){ printf "%s" "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'; }

{
  echo "/* AUTO-GENERADO. NO EDITAR. */"
  echo ';(function(){ window.IBG_ENV = window.IBG_ENV || {};'
  while IFS= read -r K; do
    [ -z "$K" ] && continue
    V="$(read_var "$K" || true)"
    V_ESC="$(escape_js "$V")"
    printf 'window.IBG_ENV["%s"]="%s";\n' "$K" "$V_ESC"
  done < .ibg_keys.txt
  echo 'console.log("[env-inline] OK ->", Object.keys(window.IBG_ENV));'
  echo '})();'
} > js/env-inline.js

# 3) Inyectar /js/env-inline.js UNA sola vez (index.html, premium.html)
say "3) Inyectar /js/env-inline.js (sin duplicados)"
inject_env_inline(){
  HTML="$1"
  [ ! -f "$HTML" ] && return 0
  if ! grep -q 'js/env-inline.js' "$HTML"; then
    awk 'BEGIN{add=0} /<\/body>/ && !add {print "  <script src=\"/js/env-inline.js\"></script>"; add=1} {print}' "$HTML" > "$HTML.tmp" && mv "$HTML.tmp" "$HTML"
    echo "· Inyectado en $HTML"
  fi
}
inject_env_inline "index.html"
inject_env_inline "premium.html"

# 4) Limpiar menú/scripts duplicados en premium.html
say "4) Limpiar duplicados (premium.html)"
if [ -f premium.html ]; then
  # quitar referencias a los intentos previos (si quedaron)
  # (se eliminan líneas exactas de esos <script> si existen)
  sed -n '1h;1!H;${;g;s/[[:space:]]*<script src="\/js\/premium-\(menu\|thumbs\|boot\|paypal\)\.js"><\/script>[[:space:]]*\n//g;p;}' premium.html > premium.html.tmp && mv premium.html.tmp premium.html

  # conservar SOLO el primer <nav id="top"...> y su </nav>
  awk '
    BEGIN{nav_seen=0; skip=0}
    /<nav[^>]*id="top"[^>]*>/ {
      if (nav_seen==1) { skip=1 } else { nav_seen=1 }
    }
    { if (skip==0) print }
    /<\/nav>/ { if (skip==1) { skip=0 } }
  ' premium.html > premium.html.tmp && mv premium.html.tmp premium.html
fi

# 5) Anuncios sólo laterales (CSS + enlace en home/premium)
say "5) Anuncios laterales (ocultar en grids)"
mkdir -p css
cat > css/ads-laterales.css <<'EOF'
#thumbs .ad, #thumbs .ad-slot,
#grid .ad, #grid .ad-slot,
.gallery .ad, .gallery .ad-slot,
.masonry .ad, .masonry .ad-slot { display:none !important; }
#ad-left, #ad-right { position:fixed; top:110px; width:160px; z-index:50; }
#ad-left{left:10px} #ad-right{right:10px}
@media (max-width:1200px){ #ad-left,#ad-right{display:none !important} }
EOF

link_ads_css(){
  HTML="$1"
  [ ! -f "$HTML" ] && return 0
  if ! grep -q 'css/ads-laterales.css' "$HTML"; then
    awk 'BEGIN{add=0} /<\/head>/ && !add {print "  <link rel=\"stylesheet\" href=\"/css/ads-laterales.css\">"; add=1} {print}' "$HTML" > "$HTML.tmp" && mv "$HTML.tmp" "$HTML"
    echo "· Enlazado ads-laterales.css en $HTML"
  fi
}
link_ads_css "index.html"
link_ads_css "premium.html"

# 6) Sustituir paypal-mark.svg por PNG oficial (evita 404)
say "6) Sustituir paypal-mark.svg por icono oficial"
PAYPAL_MARK='https://www.paypalobjects.com/webstatic/icon/pp258.png'
# Buscar solo en HTML/CSS/JS del proyecto (excluir .vercel/)
find . -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" \) -not -path "./.vercel/*" -print | while IFS= read -r F; do
  if grep -q 'paypal-mark\.svg' "$F"; then
    sed_i "s#paypal-mark\.svg#$PAYPAL_MARK#g" "$F"
    echo "· Reemplazado en $F"
  fi
done

# 7) Auditoría simple de assets referenciados en content-data2/3/4
say "7) Auditoría de imágenes de content-data* (solo REPORTA faltantes)"
TMP=.ibg_paths.txt
: > "$TMP"
for C in content-data2.js content-data3.js content-data4.js; do
  [ -f "$C" ] || continue
  # recoge rutas "full/... ext" | "uncensored/..." | "decorative-images/..."
  grep -Eo '"(full|uncensored|decorative-images)/[A-Za-z0-9._/-]+\.(jpg|jpeg|png|webp)"' "$C" \
    | sed 's/^"//; s/"$//' >> "$TMP" || true
done
if [ -s "$TMP" ]; then
  sort -u "$TMP" -o "$TMP"
  MISSING=0
  while IFS= read -r P; do
    [ -z "$P" ] && continue
    if [ ! -f "$P" ]; then
      echo "✗ Falta: $P"
      MISSING=$((MISSING+1))
    fi
  done < "$TMP"
  rm -f "$TMP"
  [ "$MISSING" -gt 0 ] && echo "⚠ Hay $MISSING archivos referenciados que no existen en el repo (se omiten en runtime)."
else
  echo "· No se detectaron rutas en content-data2/3/4.js"
fi

# 8) Commit cambios locales
say "8) Commit"
git add js css premium.html index.html >/dev/null 2>&1 || true
git commit -m "fix: env-inline; limpiar duplicados; anuncios laterales; paypal-mark 404" >/dev/null 2>&1 || true
git push origin "$(git rev-parse --abbrev-ref HEAD)" >/dev/null 2>&1 || true

# 9) Build + Deploy
say "9) Build + Deploy (PROD)"
vercel build --prod >/dev/null || true
RAW="$(vercel deploy --prebuilt --prod --yes 2>&1 || true)"
printf "%s\n" "$RAW"
URL="$(printf "%s\n" "$RAW" | grep -Eo 'https://[A-Za-z0-9._-]+\.vercel\.app' | tail -n1 || true)"
if [ -n "${URL:-}" ]; then
  echo "✅ Production: $URL"
  printf "HEAD %s -> " "$URL/premium"
  curl -sI "$URL/premium" | head -n1
else
  echo "⚠ No pude extraer URL de producción (revisa las líneas «Production: https://…vercel.app» arriba)."
fi

say "FIN"
