(function(){
  function ready(f){ if(document.readyState!=='loading') f(); else document.addEventListener('DOMContentLoaded', f); }
  function getEnv(k){
    try{
      if (typeof window!=='undefined'){
        if (window.IBG_ENV && window.IBG_ENV[k]) return window.IBG_ENV[k];
        if (window[k]) return window[k];
      }
    }catch(_){}
    return '';
  }
  function pick(slot, name){
    try{
      if (slot && slot.dataset && slot.dataset[name]) return String(slot.dataset[name]);
    }catch(_){}
    return '';
  }
  function mount(slot){
    try{
      var juicyB64 = pick(slot,'juicyB64'); if(!juicyB64) juicyB64 = getEnv('JUICYADS_SNIPPET_B64');
      var exoZone  = pick(slot,'exoZone');  if(!exoZone)  exoZone  = getEnv('EXOCLICK_ZONE');
      var eroZone  = pick(slot,'eroZone');  if(!eroZone)  eroZone  = getEnv('EROADVERTISING_ZONE');

      if (juicyB64){
        var s=document.createElement('script'); s.defer=true;
        try{ s.innerHTML = atob(juicyB64); }catch(e){ try{s.text=atob(juicyB64);}catch(_){ s.text=''; } }
        slot.appendChild(s); return;
      }
      if (exoZone){
        var d=document.createElement('div'); d.setAttribute('data-exo-zone', exoZone); slot.appendChild(d);
        var se=document.createElement('script'); se.async=true; se.src='https://a.exoclick.com/tag.php'; slot.appendChild(se); return;
      }
      if (eroZone){
        var sc=document.createElement('script'); sc.async=true; sc.src='https://a.magsrv.com/ad-provider.js'; sc.setAttribute('data-zone', eroZone); slot.appendChild(sc); return;
      }
      // sin proveedor: no rompe
      // console.info('[ads] sin proveedor', slot);
    }catch(e){ try{ console.warn('[ads] slot error', e); }catch(_){} }
  }

  ready(function(){
    try{
      var slots = document.querySelectorAll('[data-ad-slot]');
      if (!slots || !slots.length) return;
      for (var i=0; i<slots.length; i++){ mount(slots[i]); }
    }catch(e){ try{ console.warn('[ads] init', e); }catch(_){} }
  });
})();
