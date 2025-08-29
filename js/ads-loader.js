(function(){
  var ENV = window.__ENV || {};

  // ExoClick (native)
  if (ENV.EXOCLICK_ZONE) {
    (function(){
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://a.exdynsrv.com/nativeads-v2.js";
      s.dataset.idzone = String(ENV.EXOCLICK_ZONE);
      s.onload = function(){ console.info("[ads] ExoClick Listo"); };
      s.onerror = function(){ console.warn("[ads] ExoClick error"); };
      document.body.appendChild(s);
    })();
  }

  // JuicyAds
  if (ENV.JUICYADS_ZONE) {
    (function(){
      var s = document.createElement("script");
      s.async = true; s.src = "https://poweredby.jads.co/js/jads.js";
      s.onload  = function(){ console.info("[ads] JuicyAds Listo"); };
      s.onerror = function(){ console.warn("[ads] JuicyAds error"); };
      document.head.appendChild(s);

      window.adsbyjuicy = window.adsbyjuicy || [];
      window.adsbyjuicy.push({ adzone: String(ENV.JUICYADS_ZONE) });
    })();
  }

  // PopAds
  if ((ENV.POPADS_ENABLE+"").toLowerCase() === "true" && ENV.POPADS_SITE_ID) {
    (function(){
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://popads.net/pop.js";
      s.onload  = function(){ console.info("[ads] PopAds Listo"); };
      s.onerror = function(){ console.warn("[ads] PopAds error"); };
      document.head.appendChild(s);

      window._pop = window._pop || [];
      window._pop.push({popunder: true, siteId: String(ENV.POPADS_SITE_ID)});
    })();
  }
})();
