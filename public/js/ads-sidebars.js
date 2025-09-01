(function(){
  function ready(cb){ if(document.readyState!=="loading") cb(); else document.addEventListener("DOMContentLoaded", cb); }
  function G(k,d){ try{ var w=window; if(w.IBG_ENV && w.IBG_ENV[k]!=null) return String(w.IBG_ENV[k]); if(w[k]!=null) return String(w[k]); }catch(_){ } return String(d||""); }
  function mount(slot){
    try{
      var ja_id=G('JUICYADS_ZONE',''), ja_b64=G('JUICYADS_SNIPPET_B64','');
      var exo=G('EXOCLICK_ZONE',''), eroz=G('EROADVERTISING_ZONE','');
      var popid=G('POPADS_SITE_ID',''), popen=G('POPADS_ENABLE','');
      if(ja_b64){ try{ var s=document.createElement('script'); s.defer=true; s.innerHTML=atob(ja_b64); slot.appendChild(s);}catch(e){console.warn('[ads] juicy snippet',e);} }
      else if(ja_id){ try{ var s2=document.createElement('script'); s2.async=true; s2.src='https://stickyadss.com/jads.js'; s2.dataset.juicyadzone=ja_id; slot.appendChild(s2);}catch(e){console.warn('[ads] juicy id',e);} }
      if(exo){ try{ var d=document.createElement('div'); d.setAttribute('data-exo-zone',exo); slot.appendChild(d); var se=document.createElement('script'); se.async=true; se.src='https://a.exoclick.com/tag.php'; slot.appendChild(se);}catch(e){console.warn('[ads] exo',e);} }
      if(eroz){ try{ var sc=document.createElement('script'); sc.async=true; sc.src='https://a.magsrv.com/ad-provider.js'; sc.setAttribute('data-zone',eroz); slot.appendChild(sc);}catch(e){console.warn('[ads] eroadv',e);} }
      if((popen==="1"||popen==="true") && popid){ try{ var sp=document.createElement('script'); sp.async=true; sp.src='//c1.popads.net/pop.js'; sp.onload=function(){ try{ if(window.popns){ window.popns.popads_site_id=popid; } }catch(_){ } }; slot.appendChild(sp);}catch(e){console.warn('[ads] popads',e);} }
    }catch(e){ console.warn('[ads] slot error',e); }
  }
  ready(function(){ try{ var slots=document.querySelectorAll('[data-ad-slot]'); if(!slots||!slots.length){console.info('[ads] sin slots'); return;} for(var i=0;i<slots.length;i++){ mount(slots[i]); } }catch(e){ console.warn('[ads] error',e); } });
})();
