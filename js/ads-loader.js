(function(){
  var E=(window.__ENV||{});
  try{
    // EXOCLICK (zone script)
    if (E.EXOCLICK_ZONE){
      var ex=document.createElement("script");
      ex.src="https://a.exdynsrv.com/"+E.EXOCLICK_ZONE+".js";
      ex.async=true; document.body.appendChild(ex);
      console.info("[ads] ExoClick Listo");
    }
    // JUICYADS
    if (E.JUICYADS_ZONE){
      var ins=document.createElement("ins");
      ins.className="adsbyjuicy"; ins.setAttribute("data-zone", E.JUICYADS_ZONE);
      document.body.appendChild(ins);
      var j=document.createElement("script"); j.src="https://poweredby.jads.co/js/jads.js"; j.async=true;
      j.onerror=function(){ console.warn("[ads] JuicyAds fallo de carga"); };
      document.body.appendChild(j);
      console.info("[ads] JuicyAds Listo");
    }
    // POPADS
    if ((E.POPADS_ENABLE||"").toString()==="true" && E.POPADS_SITE_ID){
      var pa=document.createElement("script");
      pa.src="https://c1.popads.net/pop.js"; pa.async=true; pa.setAttribute("data-site", E.POPADS_SITE_ID);
      document.body.appendChild(pa);
      console.info("[ads] PopAds Listo");
    }
  }catch(err){ console.error("[ads] error", err); }
})();
