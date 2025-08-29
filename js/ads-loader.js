(function(){
  var ENV = (window.__ENV||{});
  try {
    // === EXOCLICK ===
    if (ENV.EXOCLICK_ZONE){
      var exo = document.createElement("script");
      exo.src = "https://a.exdynsrv.com/" + ENV.EXOCLICK_ZONE + ".js";
      exo.async = true;
      document.head.appendChild(exo);
      console.info("[ads] ExoClick Insertado");
    }
    // === JUICYADS ===
    if (ENV.JUICYADS_ZONE){
      var ins = document.createElement("ins");
      ins.className = "adsbyjuicy";
      ins.setAttribute("data-zone", ENV.JUICYADS_ZONE);
      document.body.appendChild(ins);
      var s = document.createElement("script");
      s.src = "https://poweredby.jads.co/js/jads.js";
      s.async = true;
      document.body.appendChild(s);
      console.info("[ads] JuicyAds Insertado");
    }
    // === POPADS ===
    if ((ENV.POPADS_ENABLE||"").toString()==="true" && ENV.POPADS_SITE_ID){
      var pa = document.createElement("script");
      pa.src = "https://c1.popads.net/pop.js";
      pa.setAttribute("data-site", ENV.POPADS_SITE_ID);
      pa.async = true;
      document.body.appendChild(pa);
      console.info("[ads] PopAds Insertado");
    }
  } catch(e){
    console.error("[ads] error", e);
  }
})();
