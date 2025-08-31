(function(){
  function ready(f){ if(document.readyState!=='loading') f(); else document.addEventListener('DOMContentLoaded', f); }
  function pick(slot,k){ return (slot.dataset && slot.dataset[k]) ? String(slot.dataset[k]).trim() : ''; }
  function G(k){ try{ return (window && (window.IBG_ENV && window.IBG_ENV[k] ? window.IBG_ENV[k] : window[k])) || ''; }catch(_){ return ''; } }
  function mount(slot){
    try{
      var juicyB64 = pick(slot,'juicyB64') || G('JUICYADS_SNIPPET_B64') || '';
      var exoZone  = pick(slot,'exoZone')   || G('EXOCLICK_ZONE')       || '';
      var eroZone  = pick(slot,'eroZone')   || G('EROADVERTISING_ZONE') || '';
      if (juicyB64){
        var s=document.createElement('script'); s.defer=true; s.innerHTML=atob(juicyB64); slot.appendChild(s); return;
      }
      if (exoZone){
        var d=document.createElement('div'); d.setAttribute('data-exo-zone', exoZone); slot.appendChild(d);
        var se=document.createElement('script'); se.async=true; se.src='https://a.exoclick.com/tag.php'; slot.appendChild(se); return;
      }
      if (eroZone){
        var sc=document.createElement('script'); sc.async=true; sc.src='https://a.magsrv.com/ad-provider.js'; sc.setAttribute('data-zone',eroZone); slot.appendChild(sc); return;
      }
      console.info('[ads] sin proveedor en slot', slot);
    }catch(e){ console.warn('[ads] slot error', e); }
  }
  ready(function(){
    var slots=document.querySelectorAll('[data-ad-slot]');
    if(!slots || !slots.length){ console.info('[ads] sin slots'); return; }
    for (var i=0;i<slots.length;i++) mount(slots[i]);
  });
})();
