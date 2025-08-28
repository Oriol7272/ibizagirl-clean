#!/bin/sh
set -eu
say(){ printf "\n== %s ==\n" "$*"; }

[ -f index.html ] || { echo "✗ Ejecuta en la raíz del repo (donde está index.html)"; exit 1; }

say "1) Escribiendo js/home-fixes.js con remapeos concretos"
mkdir -p js
cat > js/home-fixes.js <<'EOF'
/* HOME fixes: decorative-images → remap + fallback */
;(function(){
  // Ficheros reales existentes (según repo)
  var KNOWN = new Set([
    "1115ae7d-909f-4760-a3a1-037a05ad9931.jpg",
    "1618cbb2-8dd1-4127-99d9-d9f30536de72.jpg",
    "49830c0a-2fd8-439c-a583-02a9b039c4d6.jpg",
    "4bfb7a8b-8f1e-49d7-a610-90b83440b751.jpg",
    "81f55fd4-b0df-49f4-9020-cbb0f5042c08.jpg",
    "f062cb22-c99b-4dfa-9a79-572e98c6e75e.jpg",
    "paradise-beach.png"
  ]);

  var FALLBACK = "paradise-beach.png";

  // Remapeos conocidos (peticiones incorrectas → fichero real)
  var REMAP = {
    // Nombre mal escrito en el código → el de verdad del repo
    "115ae97d-909f-4760-a3a1-037a05ad9931.jpg": "1115ae7d-909f-4760-a3a1-037a05ad9931.jpg",
    // "Sütulo3.webp" (o URL-encoded) no existe → usa paradise-beach.png
    "S%C3%BCtulo3.webp": "paradise-beach.png",
    "Sütulo3.webp": "paradise-beach.png",
    "Sutulo3.webp": "paradise-beach.png"
  };

  function fileNameFrom(url){
    try{
      var u = new URL(url, location.href);
      var f = u.pathname.split("/").pop() || "";
      try{ return decodeURIComponent(f); }catch(_){ return f; }
    }catch(_){ return ""; }
  }
  function buildUrl(file){ return location.origin + "/decorative-images/" + file; }

  function remapName(name){
    if (REMAP[name]) return REMAP[name];
    // si no está en KNOWN, cae a fallback
    if (!KNOWN.has(name)) return FALLBACK;
    return name;
  }

  // IMG: si 404 → remap + retry; segundo fallo → ocultar
  window.addEventListener("error", function(ev){
    var el = ev.target;
    if (!el || el.tagName !== "IMG") return;
    if (el.src.indexOf("/decorative-images/") === -1) return;

    var bad = fileNameFrom(el.src);
    var good = remapName(bad);
    if (good !== bad) {
      var alt = buildUrl(good);
      console.warn("[home-fixes] remap IMG:", bad, "→", good);
      el.addEventListener("error", function hide(){ el.style.display="none"; }, {once:true});
      el.src = alt;
    } else {
      el.style.display="none";
    }
  }, true);

  // Backgrounds CSS: reescribir a URL válida si el nombre no existe
  function getBgUrl(el){
    var bi = getComputedStyle(el).backgroundImage || "";
    var m = bi.match(/url\\((['"]?)(.*?)\\1\\)/);
    return m ? m[2] : "";
  }
  function setBgUrl(el, url){ el.style.backgroundImage = 'url("' + url + '")'; }

  function fixBg(el){
    var src = getBgUrl(el);
    if (!src || src === "none") return;
    if (src.indexOf("/decorative-images/") === -1) return;
    var bad = fileNameFrom(src);
    var good = remapName(bad);
    if (good !== bad){
      var alt = buildUrl(good);
      console.warn("[home-fixes] remap BG:", bad, "→", good);
      setBgUrl(el, alt);
    }
  }

  document.addEventListener("DOMContentLoaded", function(){
    // aplica a contenedores típicos
    document.querySelectorAll("[data-decorative], .hero, header, .banner, .rotator, .hero-bg")
      .forEach(fixBg);
    console.log("[home-fixes] ready");
  });
})();
EOF

# 2) Inyectar el script en index.html (una sola vez)
say "2) Inyectando <script /js/home-fixes.js> en index.html"
if ! grep -q 'js/home-fixes.js' index.html; then
  awk 'BEGIN{add=0} /<\/body>/ && !add {print "  <script src=\"/js/home-fixes.js\"></script>"; add=1} {print}' index.html > index.html.tmp && mv index.html.tmp index.html
  echo "· Añadido a index.html"
else
  echo "· Ya estaba referenciado"
fi

# 3) Ads solo laterales (si no lo tienes aún)
say "3) CSS ads laterales (enlazar si falta)"
mkdir -p css
if ! [ -f css/ads-laterales.css ]; then
  cat > css/ads-laterales.css <<'EOF'
#thumbs .ad, #thumbs .ad-slot,
#grid .ad, #grid .ad-slot,
.gallery .ad, .gallery .ad-slot,
.masonry .ad, .masonry .ad-slot { display:none !important; }
#ad-left, #ad-right { position:fixed; top:110px; width:160px; z-index:50; }
#ad-left{left:10px} #ad-right{right:10px}
@media (max-width:1200px){ #ad-left,#ad-right{display:none !important} }
EOF
fi
if ! grep -q 'css/ads-laterales.css' index.html; then
  awk 'BEGIN{add=0} /<\/head>/ && !add {print "  <link rel=\"stylesheet\" href=\"/css/ads-laterales.css\">"; add=1} {print}' index.html > index.html.tmp && mv index.html.tmp index.html
  echo "· Enlazado en index.html"
else
  echo "· CSS ya enlazado"
fi

# 4) Commit + Deploy
say "4) Commit + Deploy"
git add js/home-fixes.js css/ads-laterales.css index.html >/dev/null 2>&1 || true
git commit -m "fix(home): decorative-images remap (115ae97d→1115ae7d, Sütulo3→paradise-beach) + ads laterales" >/dev/null 2>&1 || true
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
