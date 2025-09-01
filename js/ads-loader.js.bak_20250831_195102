// hardened ads-loader (auto)
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function ensure(sel){ try{ return document.querySelector(sel) || null; }catch(_){ return null; } }
  function get(k, d){ try{ return (window && window[k]) ? window[k] : d; }catch(_){ return d; } }

  ready(function(){
    try {
      // zona visible (si no hay, no rompemos)
      var slot = ensure('[data-ad-slot]');
      if(!slot){ console.warn('[ads] no slot visible; skipping render'); return; }

      // ejemplos de integración; cada loader debería comprobar sus ENV antes de actuar:
      var juicyId = get('JUICYADS_ZONE','');
      var juicyB64 = get('JUICYADS_SNIPPET_B64','');
      if (juicyId && juicyB64) {
        try {
          var s = document.createElement('script');
          s.defer = true;
          s.innerHTML = atob(juicyB64); // snippet b64
          slot.appendChild(s);
        } catch(e){ console.warn('[ads] juicy error', e); }
      }

      var exo = get('EXOCLICK_ZONE','');
      if (exo) {
        try {
          var d = document.createElement('div');
          d.setAttribute('data-exo-zone', exo);
          slot.appendChild(d);
          var se = document.createElement('script');
          se.src = 'https://a.exoclick.com/tag.php';
          se.async = true;
          slot.appendChild(se);
        } catch(e){ console.warn('[ads] exoclick error', e); }
      }

      var eroz = get('EROADVERTISING_ZONE','');
      if (eroz) {
        try {
          var sc = document.createElement('script');
          sc.async = true;
          sc.src = 'https://a.magsrv.com/ad-provider.js';
          sc.setAttribute('data-zone', eroz);
          slot.appendChild(sc);
        } catch(e){ console.warn('[ads] eroadvertising error', e); }
      }
    } catch(e){
      console.warn('[ads] error', e);
    }
  });
})();
