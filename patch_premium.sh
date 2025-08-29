#!/usr/bin/env bash
set -Eeuo pipefail

echo "🔗 Vercel env (prod)…"
vercel link --yes >/dev/null || true
vercel env pull .env.vercel --environment=production --yes >/dev/null

set -a
source .env.vercel || true
set +a

mkdir -p css js

###############################################################################
# 1) Fuente decorativa como en Home
###############################################################################
echo "🖋  Escribiendo css/premium-font.css…"
cat > css/premium-font.css <<'EOF'
@font-face{
  font-family:"SexyBeachy";
  src:
    url("/decorative-images/Sexy%20Beachy.otf") format("opentype"),
    url("/decorative-images/Sexy%20Beachy.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* aplica la decorativa a títulos/branding del premium */
:root{ --decorative-font: "SexyBeachy", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }

h1,h2,.site-title,.brand,.hero-title,.menu .brand, .topbar-title{
  font-family: var(--decorative-font);
  letter-spacing: .5px;
}
EOF

# Incluye el CSS en premium.html (si no está ya)
if ! grep -q 'premium-font.css' premium.html 2>/dev/null; then
  sed -i '' 's#</head>#  <link rel="stylesheet" href="/css/premium-font.css">\n</head>#' premium.html
fi

###############################################################################
# 2) PayPal SDK: una sola carga (intent=capture) y uso de window.paypal
###############################################################################
echo "💳  Escribiendo js/paypal-loader.js…"
cat > js/paypal-loader.js <<'EOF'
(function () {
  var ENV = (window.__ENV || {});
  var CID = ENV.PAYPAL_CLIENT_ID || "";
  if (!CID) { console.warn("[paypal] PAYPAL_CLIENT_ID vacío — no se carga SDK"); return; }

  function injectOnce(id, src) {
    if (document.getElementById(id)) return;
    var s = document.createElement("script");
    s.id = id; s.src = src; s.async = true; s.defer = true; s.crossOrigin = "anonymous";
    document.head.appendChild(s);
  }

  // Carga simple: buttons + intent=capture (compras sueltas)
  injectOnce(
    "sdk-paypal",
    "https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)+"&components=buttons&currency=EUR&intent=capture"
  );

  console.info("[paypal-loader] SDK solicitado (buttons/capture)");
})();
EOF

# Asegura que premium.html cargue paypal-loader.js antes de premium-thumbs.js
if ! grep -q 'js/paypal-loader.js' premium.html 2>/dev/null; then
  sed -i '' 's#<script src="/js/premium-thumbs.js"></script>#<script src="/js/paypal-loader.js"></script>\n  <script src="/js/premium-thumbs.js"></script>#' premium.html || true
fi

###############################################################################
# 3) Thumbs: forzar .webp y rutas absolutas correctas
###############################################################################
echo "🖼   Escribiendo js/premium-thumbs.js…"
cat > js/premium-thumbs.js <<'EOF'
(function () {
  try {
    var ENV  = (window.__ENV||{});
    var BASE = (ENV.BASE||"https://ibizagirl.pics").replace(/\/+$/,"");

    function ensureWebp(name){
      var s = String(name||"").trim();
      if (!s) return "";
      // si viene absoluta, solo forzamos la extensión
      var m = s.match(/^(https?:\/\/[^?#]+?)(\.[a-zA-Z0-9]+)?([?#].*)?$/);
      if (m) {
        var base = m[1], q = m[3]||"";
        if (!/\.webp$/i.test(base)) base = base.replace(/\.[a-zA-Z0-9]+$/,'') + ".webp";
        return base + q;
      }
      // relativa: quitamos carpeta y extensión, y mandamos a /uncensored/*.webp
      s = s.split('/').pop().replace(/\.[a-zA-Z0-9]+$/,'') + ".webp";
      return BASE + "/uncensored/" + s;
    }

    // juntar arrays posibles
    var all = []
      .concat(
        (window.PREMIUM_IMAGES_PART1||[]),
        (window.PREMIUM_IMAGES_PART2||[]),
        (window.IBG_PREMIUM_PART1||[]),
        (window.IBG_PREMIUM_PART2||[]),
        (window.IBG_PREMIUM||[])
      );

    if (!all.length) console.warn("[premium-thumbs] No encontré arrays premium");

    var grid = document.getElementById("premium-grid");
    if (!grid) { console.warn("premium-grid no encontrado"); return; }
    grid.innerHTML = "";

    var price = (ENV.PAYPAL_ONESHOT_PRICE_EUR_IMAGE||"0.10");

    all.slice(0,100).forEach(function(entry){
      var url = ensureWebp(entry);
      var card = document.createElement("div"); card.className = "card";
      var wrap = document.createElement("div"); wrap.className = "thumb-wrap";

      var img = document.createElement("img");
      img.loading = "lazy"; img.decoding = "async"; img.referrerPolicy = "no-referrer";
      img.src = url; img.alt = String(entry||"");

      var overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.innerHTML = '<div class="pay"><span class="pp"></span><span class="price">'+price.replace('.',',')+'€</span></div>';
      overlay.addEventListener("click", function(e){
        e.preventDefault();
        if (!window.paypal || !window.paypal.Buttons) {
          console.warn("PayPal SDK no listo"); return;
        }
        alert("Compra individual simulada (pendiente order/capture)");
      });

      wrap.appendChild(img);
      wrap.appendChild(overlay);
      card.appendChild(wrap);
      grid.appendChild(card);
    });

    console.info("[premium-thumbs] render ok:", Math.min(100, all.length), "base:", BASE);
  } catch (e) {
    console.error("[premium-thumbs] error", e);
  }
})();
EOF

###############################################################################
# Commit, push y deploy
###############################################################################
git add css/premium-font.css js/paypal-loader.js js/premium-thumbs.js premium.html || true
if git diff --cached --quiet; then
  git commit --allow-empty -m "chore(premium): force redeploy"
else
  git commit -m "fix(premium): fuente SexyBeachy, PayPal simple y normalización .webp en thumbs"
fi
git push origin main

echo "🚀 Deploy producción…"
RAW="$(vercel --prod --confirm)"
echo "$RAW"
URL="$(printf "%s\n" "$RAW" | grep -Eo 'https://[A-Za-z0-9._-]+\.vercel\.app' | tail -n1 || true)"
echo "✅ Production: ${URL:-<no-url>}"
echo "👉 ${URL}/premium"
