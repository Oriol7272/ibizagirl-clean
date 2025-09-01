(function(){
  function ready(f){ if(document.readyState!=="loading") f(); else document.addEventListener("DOMContentLoaded", f); }
  function G(k,d){ try{ return (window && ( (window.IBG_ENV&&window.IBG_ENV[k]) || window[k] )) || (d||""); }catch(_){ return d||""; } }
  function mount(slot){
    try{
      var juicyId = G("JUICYADS_ZONE",""),
          juicyB64 = G("JUICYADS_SNIPPET_B64",""),
          exo = G("EXOCLICK_ZONE",""),
          eroz = G("EROADVERTISING_ZONE","");

      if(juicyB64){ var s=document.createElement("script"); s.defer=true; try{s.innerHTML=atob(juicyB64);}catch(e){s.text=atob(juicyB64);} slot.appendChild(s); return; }

      if(exo){
        var d=document.createElement("div"); d.setAttribute("data-exo-zone",exo); slot.appendChild(d);
        var se=document.createElement("script"); se.async=true; se.src="https://a.exoclick.com/tag.php"; slot.appendChild(se);
        return;
      }

      if(eroz){
        var sc=document.createElement("script"); sc.async=true; sc.src="https://a.magsrv.com/ad-provider.js"; sc.setAttribute("data-zone",eroz); slot.appendChild(sc);
        return;
      }

      if(juicyId){
        var s2=document.createElement("script"); s2.async=true; s2.src="https://stickyadss.com/jads.js"; s2.setAttribute("data-juicyadzone",juicyId); slot.appendChild(s2);
      }
    }catch(e){ console.warn("[ads] slot",e); }
  }
  ready(function(){
    try{
      var slots=document.querySelectorAll("[data-ad-slot]");
      if(!slots||!slots.length){ console.info("[ads] sin slots"); return; }
      for(var i=0;i<slots.length;i++){ mount(slots[i]); }
    }catch(e){ console.warn("[ads] init",e); }
  });
})();
