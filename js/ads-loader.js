(function(){
  var E = (window.__ENV||{});

  // ExoClick Native
  if (E.EXOCLICK_ZONE){
    var ex = document.createElement("script");
    ex.async = true;
    ex.src = "https://a.exdynsrv.com/nativeads.js";
    ex.setAttribute("data-idzone", String(E.EXOCLICK_ZONE));
    ex.onerror = function(){ console.warn("[ads] ExoClick error"); };
    document.head.appendChild(ex);
    console.info("[ads] ExoClick listo");
  }

  // JuicyAds (shim + script oficial; sustituye URL si tu panel te da otra)
  if (E.JUICYADS_ZONE){
    window.adsbyjuicy = window.adsbyjuicy || [];
    var j = document.createElement("script");
    j.async = true;
    j.src = "https://jads.js"; // PON aquí la URL real de JuicyAds (la que te da el panel)
    j.onerror = function(){ console.warn("[ads] JuicyAds error"); };
    document.head.appendChild(j);
    console.info("[ads] JuicyAds listo");
  }

  // PopAds
  if (E.POPADS_ENABLE === "true" && E.POPADS_SITE_ID){
    var p = document.createElement("script");
    p.async = true;
    p.src = "https://popads.net/pop.js";
    p.setAttribute("data-site-id", E.POPADS_SITE_ID);
    p.onerror = function(){ console.warn("[ads] PopAds error"); };
    document.head.appendChild(p);
    console.info("[ads] PopAds listo");
  }
})();
