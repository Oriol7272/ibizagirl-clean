(() => {
  function ensureSection(){
    if (document.getElementById('ibg-premium')) return;
    const sec=document.createElement('section'); sec.id='ibg-premium';
    sec.innerHTML=`
      <style id="ibg-hide-side">
        #side-menu,.left-menu,.premium-sidebar,.sidebar,nav.side,.menu-left,[data-side="true"],.suscripciones-lateral{display:none!important}
        .header-subscriptions,.subscriptions-bar,.premium-header,.premium-menu{display:none!important}
      </style>
      <div class="topbar" aria-label="Modalidades de pago">
        <div class="slot"><h4>Mensual</h4><div id="btn-sub-monthly"></div></div>
        <div class="slot"><h4>Anual</h4><div id="btn-sub-annual"></div></div>
        <div class="slot"><h4>Lifetime (sin anuncios)</h4><div id="btn-lifetime"></div></div>
        <div class="slot"><h4>Pack 10 imágenes</h4><div id="btn-pack10"></div></div>
        <div class="slot"><h4>Pack 5 vídeos</h4><div id="btn-pack5"></div></div>
      </div>
      <div class="grid" id="thumbs-grid"></div>
    `;
    document.body.appendChild(sec);
  }
  async function boot(){
    ensureSection();
    await (window.__IBG_PayPal&&window.__IBG_PayPal.initAll(window.IBG_ENV||{}));
    window.__IBG_PremiumPay && window.__IBG_PremiumPay.renderTop();
    window.__IBG_renderThumbs && window.__IBG_renderThumbs();
  }
  if (document.readyState==='complete' || document.readyState==='interactive') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
