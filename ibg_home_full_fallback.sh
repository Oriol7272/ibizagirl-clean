#!/bin/sh
set -eu

say(){ printf "\n== %s ==\n" "$*"; }

[ -f index.html ] || { echo "✗ Ejecuta en la raíz del repo (donde está index.html)"; exit 1; }

say "1) home-gallery-fix.js (fallbacks para /full)"
mkdir -p js
cat > js/home-gallery-fix.js <<'EOF'
/*!
 * HOME /full fallback loader
 * - Reintenta .jpg → .jpeg → .png → .webp si hay 404
 * - Soporta src y data-src (lazy)
 * - Normaliza rutas relativas
 */
;(function(){
  var exts = [".jpg",".jpeg",".png",".webp"];
  var ASSETS = (window.IBG_ENV && window.IBG_ENV.IBG_ASSETS_BASE_URL) || "";
  function joinFull(p){ 
    // asegura /full/ al principio
    var path = p || "";
    if (!path) return "/full/";
    if (path.indexOf("http") === 0) return path; // ya absoluta
    if (path[0] !== "/") path = "/" + path;
    if (path.indexOf("/full/") !== 0) path = "/full" + (path.indexOf("/")===0? "":"") + path;
    if (ASSETS && ASSETS !== "/" && ASSETS !== "") {
      // si IBG_ASSETS_BASE_URL termina en /, evita doble //
      var base = ASSETS.replace(/\/+$/,"");
      return base + path;
    }
    return path;
  }
  function baseAndExt(name){
    var m = (name||"").match(/^(.*?)(\.[A-Za-z0-9]+)?$/);
    return {base:m?m[1]:name, ext:m && m[2] ? m[2].toLowerCase() : ""};
  }
  function nextSrcSequence(name){
    var n = decodeURIComponent(name||"");
    var p = n.replace(location.origin,"");
    var b = baseAndExt(p);
    var order = exts.slice(0);
    // si venía con ext conocida, pruébala primero
    if (b.ext && exts.indexOf(b.ext) >= 0) {
      order = [b.ext].concat(exts.filter(function(e){return e!==b.ext;}));
    }
    return order.map(function(e){ return joinFull(b.base + e); });
  }

  function tryLoad(img, candidates, idx){
    if (idx >= candidates.length){ 
      img.dataset.ibgTried = "1";
      img.style.display = "none"; // omite la rota
      console.warn("[home-full] omitida tras fallbacks:", img.dataset._orig || img.src);
      return;
    }
    var url = candidates[idx];
    var onErr = function(){
      img.removeEventListener("error", onErr);
      tryLoad(img, candidates, idx+1);
    };
    img.addEventListener("error", onErr, {once:true});
    img.src = url;
  }

  function prime(img){
    if (img.dataset.ibgTried === "1") return;
    // toma src o data-src
    var raw = img.getAttribute("data-src") || img.getAttribute("src") || "";
    if (!raw) return;
    img.dataset._orig = raw;
    var list = nextSrcSequence(raw);
    // comienza: el primero forzará onerror si no existe
    tryLoad(img, list, 0);
  }

  function scan(root){
    (root||document).querySelectorAll("img").forEach(function(img){
      var raw = img.getAttribute("data-src") || img.getAttribute("src") || "";
      if (!raw) return;
      // sólo imágenes destinadas a /full o sin prefijo (las normalizamos a /full)
      if (raw.indexOf("/full/")===0 || raw.indexOf("http")!==0){
        prime(img);
      }
    });
  }

  // inicial
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function(){ scan(document); });
  } else {
    scan(document);
  }

  // dinámicas (carrousel/gallery que rendericen después)
  var mo = new MutationObserver(function(muts){
    muts.forEach(function(m){
      m.addedNodes && m.addedNodes.forEach(function(n){
        if (n.nodeType===1){
          if (n.tagName==="IMG") prime(n);
          else scan(n);
        }
      });
    });
  });
  mo.observe(document.documentElement, {subtree:true, childList:true});
  console.log("[home-full] fallback loader activo");
})();
EOF

say "2) Inyectar js/home-gallery-fix.js en index.html (una sola vez)"
if ! grep -q 'js/home-gallery-fix.js' index.html; then
  awk 'BEGIN{add=0} /<\/body>/ && !add {print "  <script src=\"/js/home-gallery-fix.js\"></script>"; add=1} {print}' index.html > index.html.tmp && mv index.html.tmp index.html
  echo "· Añadido a index.html"
else
  echo "· Ya estaba referenciado"
fi

say "3) Commit + Deploy (PROD)"
git add js/home-gallery-fix.js index.html >/dev/null 2>&1 || true
git commit -m "fix(home): fallback robusto /full (jpg→jpeg→png→webp) para carrusel+galería" >/dev/null 2>&1 || true
git push origin "$(git rev-parse --abbrev-ref HEAD)" >/dev/null 2>&1 || true

vercel build --prod >/dev/null 2>&1 || true
RAW="$(vercel deploy --prebuilt --prod --yes 2>&1 || true)"
printf "%s\n" "$RAW"
URL="$(printf "%s\n" "$RAW" | grep -Eo 'https://[A-Za-z0-9._-]+\.vercel\.app' | tail -n1 || true)"
if [ -n "${URL:-}" ]; then
  echo "✅ Production: $URL"
  printf "HEAD %s/home -> " "$URL"
  curl -sI "$URL" | head -n1
else
  echo "⚠ No pude extraer URL de producción (mira la salida arriba)."
fi

say "FIN HOME"
