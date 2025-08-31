(function(){
  function ready(f){ if(document.readyState!=="loading") f(); else document.addEventListener("DOMContentLoaded", f); }
  function G(k,d){
    try{
      var W = (typeof window!=="undefined") ? window : {};
      if (W.IBG_ENV && W.IBG_ENV[k] != null && W.IBG_ENV[k] !== "") return W.IBG_ENV[k];
      if (W[k] != null && W[k] !== "") return W[k];
    }catch(_){}
    return d || "";
  }
  function mount(slot){
    try{
      if(!slot) return;
      var juicyId = G("JUICYADS_ZONE",""),
          juicyB64= G("JUICYADS_SNIPPET_B64",""),
          exo    = G("EXOCLICK_ZONE",""),
          eroz   = G("EROADVERTISING_ZONE","");

      if (juicyB64) {
        try{
          var s=document.createElement("script"); s.defer=true;
          try { s.innerHTML = atob(juicyB64); } catch(_) { s.text = atob(juicyB64); }
          slot.appendChild(s);
          return;
        }catch(e){ console.warn("[ads] juicy b64", e); }
      }
      if (exo) {
        try{
          var d=document.createElement("div"); d.setAttribute("data-exo-zone", exo); slot.appendChild(d);
          var se=document.createElement("script"); se.async=true; se.src="https://a.exoclick.com/tag.php"; slot.appendChild(se);
          return;
        }catch(e){ console.warn("[ads] exo", e); }
      }
      if (eroz) {
        try{
          var sc=document.createElement("script"); sc.async=true; sc.src="https://a.magsrv.com/ad-provider.js"; sc.setAttribute("data-zone", eroz); slot.appendChild(sc);
          return;
        }catch(e){ console.warn("[ads] eroadv", e); }
      }
      if (juicyId) {
        try{
          var s2=document.createElement("script"); s2.async=true; s2.src="https://stickyadss.com/jads.js"; s2.setAttribute("data-juicyadzone", juicyId); slot.appendChild(s2);
        }catch(e){ console.warn("[ads] juicy id", e); }
      }
    }catch(e){ console.warn("[ads] slot error", e); }
  }
  ready(function(){
    try{
      var nodes = document.querySelectorAll("[data-ad-slot]");
      if(!nodes || !nodes.length){ console.info("[ads] sin slots"); return; }
      for (var i=0; i<nodes.length; i++){ mount(nodes[i]); }
    }catch(e){ console.warn("[ads] init", e); }
  });
})();
