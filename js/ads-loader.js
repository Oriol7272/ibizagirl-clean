(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function G(k, d){ try{ return (window && window[k]!=null) ? window[k] : d; }catch(_){ return d; } }

  function providerAvailable(){
    var juicy  = !!G('JUICYADS_ZONE','') && !!G('JUICYADS_SNIPPET_B64','');
    var exo    = !!G('EXOCLICK_ZONE','');
    var eroadv = !!G('EROADVERTISING_ZONE','');
    if (juicy) return 'juicy';
    if (exo)   return 'exo';
    if (eroadv)return 'ero';
    return '';
  }

  function fillSlot(slot){
    try{
      var wanted = (slot.getAttribute('data-provider')||'').toLowerCase();
      var picked = wanted || providerAvailable();
      if(!picked){ console.info('[ads] sin proveedor disponible'); return; }

      if(picked==='juicy'){
        try{
          var b64 = String(G('JUICYADS_SNIPPET_B64',''));
          if(b64){
            var s=document.createElement('script'); s.defer=true; s.innerHTML=atob(b64); slot.appendChild(s);
          }
        }catch(e){ console.warn('[ads] juicy',e); }
        return;
      }

      if(picked==='exo'){
        try{
          var exo=G('EXOCLICK_ZONE','');
          if(exo){
            var d=document.createElement('div'); d.setAttribute('data-exo-zone',exo); slot.appendChild(d);
            var se=document.createElement('script'); se.src='https://a.exoclick.com/tag.php'; se.async=true; slot.appendChild(se);
          }
        }catch(e){ console.warn('[ads] exo',e); }
        return;
      }

      if(picked==='ero'){
        try{
          var eroz=G('EROADVERTISING_ZONE','');
          if(eroz){
            var sc=document.createElement('script'); sc.async=true; sc.src='https://a.magsrv.com/ad-provider.js'; sc.setAttribute('data-zone',eroz); slot.appendChild(sc);
          }
        }catch(e){ console.warn('[ads] eroadv',e); }
        return;
      }
    }catch(e){ console.warn('[ads] slot error', e); }
  }

  ready(function(){
    try{
      var slots = document.querySelectorAll('[data-ad-slot]');
      if(!slots || !slots.length){ console.info('[ads] sin slots'); return; }
      slots.forEach(function(slot){ fillSlot(slot); });
    }catch(e){ console.warn('[ads] error',e); }
  });
})();
