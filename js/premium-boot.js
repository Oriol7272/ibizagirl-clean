(function(){
  // === Inyección de barra superior y contenedores ===
  function el(html){ var t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstChild; }

  // Topbar (5 botones) + 5 contenedores PayPal
  var topbar = el(`
    <div id="premium-topbar" style="position:sticky;top:0;z-index:50;background:rgba(0,0,0,.35);backdrop-filter:blur(6px);padding:12px 10px;">
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:center;">
        <button id="btn-pack10"   class="ibg-pill">Pack 10 imágenes</button>
        <button id="btn-pack5v"   class="ibg-pill">Pack 5 vídeos</button>
        <button id="btn-monthly"  class="ibg-pill">Mensual</button>
        <button id="btn-annual"   class="ibg-pill">Anual</button>
        <button id="btn-lifetime" class="ibg-pill">Lifetime (sin anuncios)</button>
      </div>
      <div id="paypal-topbar" style="margin-top:10px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
        <div id="paypal-pack10"></div>
        <div id="paypal-pack5v"></div>
        <div id="paypal-monthly"></div>
        <div id="paypal-annual"></div>
        <div id="paypal-lifetime"></div>
      </div>
      <div style="text-align:center;margin-top:6px">
        <img alt="PayPal" src="https://www.paypalobjects.com/images/shared/paypal-logo-129x32.svg" height="18">
      </div>
    </div>
  `);

  // Estilos + grid (100 thumbs)
  var styles = el(`<style>
    .ibg-pill{border:0;border-radius:9999px;padding:8px 14px;background:#00457c;color:#fff;font-weight:700;cursor:pointer}
    .ibg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px}
    .ibg-card{position:relative;border-radius:14px;overflow:hidden;background:#ffffff12;box-shadow:0 8px 22px rgba(0,0,0,.15)}
    .ibg-card img{width:100%;height:160px;object-fit:cover;filter:blur(10px);transform:scale(1.06)}
    .ibg-card.new::after{content:"NEW";position:absolute;top:8px;right:8px;background:#ff3b5c;color:#fff;font-size:11px;padding:4px 7px;border-radius:8px;font-weight:800}
    .ibg-pay{position:absolute;left:8px;bottom:8px;width:136px}
    .ibg-ad{display:flex;align-items:center;justify-content:center;height:160px;border:1px dashed #ffffff40;border-radius:14px;color:#fff;font-size:12px}
  </style>`);

  var gridWrap = el(`
    <div id="premium-area" style="padding:18px 12px 80px;">
      <h3 style="color:#fff;margin:0 0 10px 6px;font-weight:800;">Contenido premium</h3>
      <div id="premium-grid" class="ibg-grid"></div>
    </div>
  `);

  // Inserción: justo al principio del <body>
  var body = document.body;
  if (body && !document.getElementById('premium-topbar')) {
    body.insertBefore(topbar, body.firstChild || null);
    body.insertBefore(styles, body.firstChild || null);
  }
  if (!document.getElementById('premium-grid')) {
    body.appendChild(gridWrap);
  }

  // Asegura que los otros scripts existan (si el HTML no los incluye)
  function ensureScript(src){
    if ([...document.scripts].some(s=>s.src.includes(src))) return;
    var s=document.createElement('script'); s.src=src; document.body.appendChild(s);
  }
  ensureScript('/js/paypal-init.js');
  ensureScript('/js/premium-thumbs.js');
  ensureScript('/js/premium-paypal.js');
})();
