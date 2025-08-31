(function(){
  function ready(cb){ if(document.readyState!=="loading") cb(); else document.addEventListener("DOMContentLoaded", cb); }
  function G(k,def){ try{ return (window && (window.IBG_ENV?.[k] ?? window[k])) || def || ""; }catch(_){ return def || ""; } }
  function fill(slot){
    try{
      if(!slot) return;
      var ja_id = G('JUICYADS_ZONE','');
      var ja_b64= G('JUICYADS_SNIPPET_B64','');
      var exo   = G('EXOCLICK_ZONE','');
      var eroz  = G('EROADVERTISING_ZONE','');
      var popid = G('POPADS_SITE_ID','');
      var popen = G('POPADS_ENABLE','');

      // JuicyAds: preferimos snippet base64 si existe
      if(ja_b64){
        try{
          var s=document.createElement('script'); s.defer=true; s.innerHTML=atob(ja_b64); slot.appendChild(s);
        }catch(e){ console.warn('[ads] juicy snippet',e); }
      }else if(ja_id){
        try{
          var s=document.createElement('script'); s.async=true;
          s.src='https://stickyadss.com/jads.js'; // url típica; si tienes otra, cambiar
          s.dataset.juicyadzone=ja_id;
          slot.appendChild(s);
        }catch(e){ console.warn('[ads] juicy id',e); }
      }

      // ExoClick
      if(exo){
        try{
          var d=document.createElement('div'); d.setAttribute('data-exo-zone',exo); slot.appendChild(d);
          var se=document.createElement('script'); se.async=true; se.src='https://a.exoclick.com/tag.php'; slot.appendChild(se);
        }catch(e){ console.warn('[ads] exo',e); }
      }

      // EroAdvertising / Magsrv
      if(eroz){
        try{
          var sc=document.createElement('script'); sc.async=true; sc.src='https://a.magsrv.com/ad-provider.js'; sc.setAttribute('data-zone',eroz); slot.appendChild(sc);
        }catch(e){ console.warn('[ads] eroadv',e); }
      }

      // PopAds (si lo activas)
      if(popen && (popen==="1" || popen==="true") && popid){
        try{
          var sp=document.createElement('script'); sp.async=true;
          sp.src='//c1.popads.net/pop.js';
          sp.onload=function(){ try{ if(window.popns){ window.popns.popads_site_id=popid; } }catch(_){} };
          slot.appendChild(sp);
        }catch(e){ console.warn('[ads] popads',e); }
      }

    }catch(e){ console.warn('[ads] slot error', e); }
  }

  ready(function(){
    try{
      var slots = document.querySelectorAll('[data-ad-slot]');
      if(!slots || !slots.length){ console.info('[ads] sin slots'); return; }
      slots.forEach(function(slot){ fill(slot); });
    }catch(e){ console.warn('[ads] error',e); }
  });
})();
