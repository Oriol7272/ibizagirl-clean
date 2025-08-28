#!/bin/sh
# ─────────────────────────────────────────────────────────────
# ibg_home_repair.sh — Recupera HOME sin tocar variables
# - Fixa 404 de decorative-images (dominio + acentos)
# - Ads solo laterales
# - Commit + Deploy
# ─────────────────────────────────────────────────────────────
set -eu

say(){ printf "\n== %s ==\n" "$*"; }

[ -f "index.html" ] || { echo "✗ Ejecuta en la raíz del repo (donde está index.html)"; exit 1; }

# 1) Asegurar settings locales de Vercel (no toca tus claves)
say "1) vercel pull (project settings)"
vercel pull --yes >/dev/null 2>&1 || true

# 2) JS de reparación para HOME
say "2) Escribiendo js/home-fixes.js"
mkdir -p js
cat > js/home-fixes.js <<'EOF'
/* AUTO — HOME fixes (decorative-images + acentos + dominio local) */
;(function(){
  function normalizeName(s){
    try{ return s.normalize('NFD').replace(/[\u0300-\u036f]/g,''); }catch(_){ return s; }
  }
  function toLocalDecor(url){
    try{
      var u = new URL(url, window.location.href);
      if(!/\/decorative-images\//.test(u.pathname)) return null;
      var fname = u.pathname.split('/').pop() || '';
      try{ fname = decodeURIComponent(fname); }catch(_){}
      fname = normalizeName(fname);
      return window.location.origin + '/decorative-images/' + fname;
    }catch(_){ return null; }
  }

  // 1) IMG 404 → reintento local + normalización; si vuelve a fallar, ocultar
  window.addEventListener('error', function(ev){
    var el = ev.target;
    if(!el || el.tagName !== 'IMG') return;
    if(!/\/decorative-images\//.test(el.src)) return;

    var alt = toLocalDecor(el.src);
    if(alt && el.src !== alt){
      console.warn('[home-fixes] 404 decorative -> retry local:', alt);
      // segundo nivel: si vuelve a fallar, ocultar
      el.addEventListener('error', function hideOnce(){ el.removeEventListener('error', hideOnce); el.style.display='none'; }, {once:true});
      el.src = alt;
    }else{
      el.style.display='none';
    }
  }, true);

  // 2) Backgrounds CSS (hero/rotator/banner) → forzar a local si apuntan a dominio externo
  function getBgUrl(el){
    var bi = getComputedStyle(el).backgroundImage || '';
    var m = bi.match(/url\((['"]?)(.*?)\1\)/);
    return m ? m[2] : '';
  }
  function setBgUrl(el, url){
    el.style.backgroundImage = 'url("' + url + '")';
  }
  function maybeSwapBg(el){
    var src = getBgUrl(el);
    if(!src || src === 'none') return;
    if(src.indexOf('/decorative-images/') === -1) return;
    try{
      var u = new URL(src, location.href);
      if(u.hostname !== location.hostname || /(%[0-9A-F]{2})/i.test(src)){
        var alt = toLocalDecor(src);
        if(alt){
          setBgUrl(el, alt);
          console.log('[home-fixes] bg swapped ->', alt);
        }
      }
    }catch(_){}
  }

  document.addEventListener('DOMContentLoaded', function(){
    // elementos típicos de hero/rotator/banner (ajustable a tus clases reales)
    var nodes = document.querySelectorAll('[data-decorative], .hero, header, .banner, .rotator, .hero-bg');
    nodes.forEach(maybeSwapBg);
    console.log('[home-fixes] ready');
  });
})();
EOF

# 3) Inyectar el script SOLO una vez en HOME
say "3) Inyectar <script /js/home-fixes.js> en index.html (una vez)"
if ! grep -q 'js/home-fixes.js' index.html; then
  awk 'BEGIN{add=0} /<\/body>/ && !add {print "  <script src=\"/js/home-fixes.js\"></script>"; add=1} {print}' index.html > index.html.tmp && mv index.html.tmp index.html
  echo "· Inyectado en index.html"
else
  echo "· Ya estaba referenciado en index.html"
fi

# 4) Ads SOLO laterales (oculta banners en grid/galería)
say "4) CSS: anuncios solo laterales (enlazar si falta)"
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

if ! grep -q 'css/ads-laterales.css' index.html; then
  awk 'BEGIN{add=0} /<\/head>/ && !add {print "  <link rel=\"stylesheet\" href=\"/css/ads-laterales.css\">"; add=1} {print}' index.html > index.html.tmp && mv index.html.tmp index.html
  echo "· Enlazado ads-laterales.css en index.html"
else
  echo "· CSS ya enlazado en index.html"
fi

# 5) Commit + Deploy
say "5) Commit + Deploy (PROD)"
git add js/home-fixes.js css/ads-laterales.css index.html >/dev/null 2>&1 || true
git commit -m "fix(home): fallback decorative-images (dominio+acentos) + ads laterales" >/dev/null 2>&1 || true
git push origin "$(git rev-parse --abbrev-ref HEAD)" >/dev/null 2>&1 || true

vercel build --prod >/dev/null 2>&1 || true
RAW="$(vercel deploy --prebuilt --prod --yes 2>&1 || true)"
printf "%s\n" "$RAW"
URL="$(printf "%s\n" "$RAW" | grep -Eo 'https://[A-Za-z0-9._-]+\.vercel\.app' | tail -n1 || true)"
if [ -n "${URL:-}" ]; then
  echo "✅ Production: $URL"
  printf "HEAD %s -> " "$URL"
  curl -sI "$URL" | head -n1
else
  echo "⚠ No pude extraer URL de producción arriba."
fi

say "FIN (HOME)"
