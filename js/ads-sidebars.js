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
  function mount(slot){
    try{
      var juicyB64 = (slot && slot.dataset && slot.dataset.juicyB64) ? String(slot.dataset.juicyB64) : '';
      var exoZone  = (slot && slot.dataset && slot.dataset.exoZone)   ? String(slot.dataset.exoZone)   : '';
      var eroZone  = (slot && slot.dataset && slot.dataset.eroZone)   ? String(slot.dataset.eroZone)   : '';
      if(!juicyB64) juicyB64 = getEnv('JUICYADS_SNIPPET_B64');
      if(!exoZone)  exoZone  = getEnv('EXOCLICK_ZONE');
      if(!eroZone)  eroZone  = getEnv('EROADVERTISING_ZONE');

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
    }catch(e){ try{ console.warn('[ads] slot error', e); }catch(_){} }
  }
  ready(function(){
    try{
      var slots = document.querySelectorAll('[data-ad-slot]');
      if (!slots || !slots.length) return;
      for (var i=0;i<slots.length;i++) mount(slots[i]);
    }catch(e){ try{ console.warn('[ads] init', e); }catch(_){} }
  });
})();
