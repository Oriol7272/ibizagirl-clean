/* robust ads loader */
(function(){
  function insertHouseAd(slot){
    if (!slot) return;
    slot.innerHTML =
      '<a href="/premium.html" class="ad-fallback" style="display:block;border:1px solid #eee;padding:8px;text-align:center;font-family:sans-serif;text-decoration:none;">' +
      '🔥 Acceso PREMIUM — Fotos y vídeos sin censura' +
      '</a>';
  }

  function tryProvider(){
    return new Promise(function(resolve, reject){
      try{
        var s = document.createElement('script');
        s.src = (window.__ADS_SRC || 'https://c.adsco.re/p');
        s.async = true;
        s.onload = function(){ resolve(); };
        s.onerror = function(){ reject(new Error('ads load error')); };
        (document.head || document.getElementsByTagName('head')[0] || document.documentElement).appendChild(s);
        setTimeout(function(){ reject(new Error('ads timeout')); }, 5000);
      }catch(e){ reject(e); }
    });
  }

  function fillSlots(){
    var list = document.querySelectorAll ? document.querySelectorAll('[data-ad-slot]') : [];
    if (!list || !list.forEach) return;
    list.forEach(function(slot){
      if (!slot) return;
      if (typeof window.renderAd === 'function') {
        try { window.renderAd(slot.getAttribute('data-ad-slot'), slot); }
        catch(e){ insertHouseAd(slot); }
      } else {
        insertHouseAd(slot);
      }
    });
  }

  function init(){
    tryProvider().then(fillSlots).catch(function(){
      console.warn('[ads] proveedor falló/bloqueado → fallback');
      var list = document.querySelectorAll ? document.querySelectorAll('[data-ad-slot]') : [];
      list.forEach(insertHouseAd);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else {
    init();
  }
})();
