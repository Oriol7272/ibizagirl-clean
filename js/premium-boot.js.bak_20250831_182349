(function(){
  var KILL=[
    '#side-menu','.left-menu','.premium-sidebar','.sidebar','nav.side','.menu-left','[data-side="true"]',
    '.suscripciones-lateral','.header-subscriptions','.subscriptions-bar','.premium-header','.premium-menu',
    'section.premium','.content-premium','.contenido-premium','.masonry','.image-list','.photos','.gallery','.premium-grid'
  ];
  function nuke(){ try{ var sel=KILL.join(','); var els=document.querySelectorAll(sel); for(var i=0;i<els.length;i++) els[i].parentNode && els[i].parentNode.removeChild(els[i]); }catch(_){ } }
  function ensureSection(){
    if(document.getElementById('ibg-premium')) return;
    var sec=document.createElement('section'); sec.id='ibg-premium';
    sec.innerHTML =
      '<div class="topbar" aria-label="Modalidades de pago">'
        +'<div class="slot"><h4>Mensual</h4><div id="btn-sub-monthly"></div></div>'
        +'<div class="slot"><h4>Anual</h4><div id="btn-sub-annual"></div></div>'
        +'<div class="slot"><h4>Lifetime (sin anuncios)</h4><div id="btn-lifetime"></div></div>'
        +'<div class="slot"><h4>Pack 10 imágenes</h4><div id="btn-pack10"></div></div>'
        +'<div class="slot"><h4>Pack 5 vídeos</h4><div id="btn-pack5"></div></div>'
      +'</div>'
      +'<div class="ibggrid" id="thumbs-grid"></div>';
    document.body.insertBefore(sec, document.body.firstChild);
  }
  function boot(){
    nuke(); ensureSection();
    if(window.__IBG_PayPal) window.__IBG_PayPal.initAll(window.IBG_ENV||{});
    if(window.__IBG_PremiumPay) window.__IBG_PremiumPay.renderTop();
    if(window.__IBG_renderThumbs) window.__IBG_renderThumbs();
    // Mantener limpio si el sitio reinyecta algo
    var mo=new MutationObserver(function(){ nuke(); });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete' || document.readyState==='interactive') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
