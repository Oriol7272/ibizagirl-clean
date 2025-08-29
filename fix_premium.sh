#!/usr/bin/env bash
set -Eeuo pipefail

echo "🔗 Link a Vercel y pull de ENVs (producción)…"
vercel link --yes >/dev/null || true
vercel env pull .env.vercel --environment=production --yes >/dev/null

echo "📥 Cargando variables…"
set -a
# shellcheck disable=SC1091
source .env.vercel || true
set +a

mkdir -p js

echo "🧩 Escribiendo js/env-inline.js…"
cat > js/env-inline.js <<EOF
(() => {
  window.__ENV = {
    BASE: "${IBG_ASSETS_BASE_URL:-https://ibizagirl.pics}",
    PAYPAL_CLIENT_ID: "${PAYPAL_CLIENT_ID:-}",
    PAYPAL_PLAN_ID_MONTHLY: "${PAYPAL_PLAN_MONTHLY_1499:-${PAYPAL_PLAN_ID_MONTHLY:-}}",
    PAYPAL_PLAN_ID_ANNUAL:  "${PAYPAL_PLAN_ANNUAL_4999:-${PAYPAL_PLAN_ID_ANNUAL:-}}",
    PAYPAL_ONESHOT_PRICE_EUR_IMAGE:    "${PAYPAL_ONESHOT_PRICE_EUR_IMAGE:-${PAYPAL_ONESHOT_PACK10_IMAGES_EUR:-0.10}}",
    PAYPAL_ONESHOT_PRICE_EUR_VIDEO:    "${PAYPAL_ONESHOT_PRICE_EUR_VIDEO:-${PAYPAL_ONESHOT_PACK5_VIDEOS_EUR:-0.30}}",
    PAYPAL_ONESHOT_PRICE_EUR_LIFETIME: "${PAYPAL_ONESHOT_PRICE_EUR_LIFETIME:-100.00}",
    EXOCLICK_ZONE: "${EXOCLICK_ZONE:-}",
    JUICYADS_ZONE: "${JUICYADS_ZONE:-}",
    EROADVERTISING_ZONE: "${EROADVERTISING_ZONE:-}",
    POPADS_ENABLE: "${POPADS_ENABLE:-true}",
    POPADS_SITE_ID: "${POPADS_SITE_ID:-}"
  };
  console.info("[env-inline] window.__ENV", window.__ENV);
})();
EOF

echo "🧩 Escribiendo js/paypal-loader.js…"
cat > js/paypal-loader.js <<'EOF'
(function () {
  var ENV = (window.__ENV || {});
  var CID = ENV.PAYPAL_CLIENT_ID || "";
  if (!CID) { console.warn("[paypal] PAYPAL_CLIENT_ID vacío — no se cargan SDKs"); return; }

  function injectOnce(id, src) {
    if (document.getElementById(id)) return;
    var s = document.createElement("script");
    s.id = id; s.src = src; s.async = true; s.defer = true; s.crossOrigin = "anonymous";
    document.head.appendChild(s);
  }

  // Oneshot (intent=capture)
  injectOnce(
    "sdk-paypal-buy",
    "https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)
      +"&components=buttons&currency=EUR&intent=capture&data-namespace=paypal_buy"
  );

  // Suscripciones (intent=subscription + vault)
  var MONTH = ENV.PAYPAL_PLAN_ID_MONTHLY || "";
  var YEAR  = ENV.PAYPAL_PLAN_ID_ANNUAL  || "";
  if (MONTH || YEAR) {
    injectOnce(
      "sdk-paypal-subs",
      "https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)
        +"&components=buttons&currency=EUR&intent=subscription&vault=true&data-namespace=paypal_subs"
    );
  }

  console.info("[paypal-loader] SDKs solicitados (buy/subs)");
})();
EOF

echo "🧩 Escribiendo js/premium-thumbs.js…"
cat > js/premium-thumbs.js <<'EOF'
(function () {
  try {
    var ENV  = (window.__ENV||{});
    var BASE = (ENV.BASE||"https://ibizagirl.pics").replace(/\/+$/,"");

    function absolutize(p){
      if (!p) return "";
      if (/^https?:\/\//i.test(p)) return p;
      if (p[0] === "/") return BASE + p;
      return BASE + "/" + p;
    }

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
    all.slice(0,100).forEach(function(path){
      var url = absolutize(String(path));
      var card = document.createElement("div"); card.className = "card";
      var wrap = document.createElement("div"); wrap.className = "thumb-wrap";

      var img = document.createElement("img");
      img.loading = "lazy"; img.decoding = "async"; img.referrerPolicy = "no-referrer";
      img.src = url; img.alt = path;

      var overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.innerHTML = '<div class="pay"><span class="pp"></span><span class="price">'+price.replace('.',',')+'€</span></div>';
      overlay.addEventListener("click", function(e){
        e.preventDefault();
        if (!window.paypal_buy || !window.paypal_buy.Buttons) {
          console.warn("paypal_buy SDK no cargado (PAYPAL_CLIENT_ID?)"); return;
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

echo "📝 Commit & push…"
git add js/env-inline.js js/paypal-loader.js js/premium-thumbs.js || true
if git diff --cached --quiet; then
  git commit --allow-empty -m "chore: force redeploy premium (no-op)"
else
  git commit -m "fix(premium): ENV desde Vercel prod, PayPal SDKs y rutas absolutas sin dobles"
fi
git push origin main

echo "🚀 Deploy producción…"
RAW="$(vercel --prod --confirm)"
echo "$RAW"
URL="$(printf "%s\n" "$RAW" | grep -Eo 'https://[A-Za-z0-9._-]+\.vercel\.app' | tail -n1 || true)"
echo "✅ Production: ${URL:-<no-url>}"
echo "👉 ${URL}/premium"
