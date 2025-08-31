(function(){
  function ready(f){ if(document.readyState!=='loading') f(); else document.addEventListener('DOMContentLoaded', f); }
  function G(k,d){ try{ return (window && window[k]!=null) ? window[k] : d; }catch(_){ return d; } }
  function provider(){
    var juicy  = !!G('JUICYADS_ZONE','') && !!G('JUICYADS_SNIPPET_B64','');
    var exo    = !!G('EXOCLICK_ZONE','');
    var eroz   = !!G('EROADVERTISING_ZONE','');
    if (juicy) return 'juicy';
    if (exo)   return 'exo';
    if (eroz)  return 'ero';
    return '';
  }
  function mount(slot, picked){
    try{
      if(picked==='juicy'){
        var b64 = String(G('JUICYADS_SNIPPET_B64',''));
        if(b64){ var s=document.createElement('script'); s.defer=true; s.innerHTML=atob(b64); slot.appendChild(s); }
        return;
      }
      if(picked==='exo'){
        var zid=G('EXOCLICK_ZONE','');
        if(zid){ var d=document.createElement('div'); d.setAttribute('data-exo-zone',zid); slot.appendChild(d);
                 var se=document.createElement('script'); se.src='https://a.exoclick.com/tag.php'; se.async=true; slot.appendChild(se); }
        return;
      }
      if(picked==='ero'){
        var z=G('EROADVERTISING_ZONE','');
        if(z){ var sc=document.createElement('script'); sc.async=true; sc.src='https://a.magsrv.com/ad-provider.js'; sc.setAttribute('data-zone',z); slot.appendChild(sc); }
        return;
      }
    }catch(e){ console.warn('[ads] mount',e); }
  }
  ready(function(){
    try{
      var p = provider();
      var slots = document.querySelectorAll('[data-ad-slot]');
      if(!p || !slots || !slots.length){ console.info('[ads] sin proveedor o sin slots'); return; }
      for (var i=0;i<slots.length;i++){ mount(slots[i], p); }
    }catch(e){ console.warn('[ads] error',e); }
  });
})();
