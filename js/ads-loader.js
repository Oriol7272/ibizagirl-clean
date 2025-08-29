(function(){
  try{
    var ENV = (window.__ENV||{});
    // EXOCLICK
    if (ENV.EXOCLICK_ZONE){
      // Ejemplo: splash nativo (CORS de OPTIONS puede fallar, el script fallback muestra los ads igual)
      var ex = document.createElement("script");
      ex.async = true;
      ex.src = "https://a.magsrv.com/ad-provider.js";
      ex.onload = function(){
        try{
          window.AdProvider && window.AdProvider.init({
            zoneId: ENV.EXOCLICK_ZONE
          });
          console.info("[ads] ExoClick Listo");
        }catch(err){ console.warn("[ads] ExoClick fallback", err); }
      };
      document.head.appendChild(ex);
    }

    // JUICYADS
    if (ENV.JUICYADS_ZONE){
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://poweredby.jads.co/js/jads.js";
      s.onload = function(){
        try{
          window.jads = window.jads||{};
          window.jads.zone = window.jads.zone||[];
          window.jads.zone.push({id: ENV.JUICYADS_ZONE});
          console.info("[ads] JuicyAds Listo");
        }catch(err){ console.warn("[ads] JuicyAds error", err); }
      };
      document.head.appendChild(s);
    }

    // POPADS
    if ((ENV.POPADS_ENABLE||"").toString() === "true" && ENV.POPADS_SITE_ID){
      var pa = document.createElement("script");
      pa.async = true;
      pa.src = "https://c1.popads.net/pop.js";
      pa.setAttribute("data-site", ENV.POPADS_SITE_ID);
      pa.onload = function(){ console.info("[ads] PopAds Listo"); };
      document.head.appendChild(pa);
    }
  }catch(e){
    console.error("[ads] error", e);
  }
})();
