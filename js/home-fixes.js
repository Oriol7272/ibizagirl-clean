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
