(function(){
  var ENV = window.__ENV || {};

  // ExoClick (script + div placeholder si aplica)
  try{
    if (ENV.EXOCLICK_ZONE){
      var exo = document.createElement('script');
      exo.src = "https://a.exdynsrv.com/ad-provider.js";
      exo.async = true; exo.defer = true;
      exo.onload = function(){ console.info("[ads] ExoClick Listo"); };
      exo.onerror = function(){ console.warn("[ads] ExoClick error"); };
      document.head.appendChild(exo);
    }
  }catch(e){ console.warn(e); }

  // JuicyAds (script oficial)
  try{
    if (ENV.JUICYADS_ZONE){
      var j = document.createElement('script');
      j.src = "https://js.juicyads.com/jads.js";
      j.async = true; j.defer = true;
      j.onload = function(){ console.info("[ads] JuicyAds Listo"); };
      j.onerror = function(){ console.warn("[ads] JuicyAds error"); };
      document.head.appendChild(j);
      // Evitar 'adsbyjuicy' undefined si algún snippet lo usa
      window.adsbyjuicy = window.adsbyjuicy || [];
    }
  }catch(e){ console.warn(e); }

  // PopAds
  try{
    if (String(ENV.POPADS_ENABLE).toLowerCase() === "true" && ENV.POPADS_SITE_ID){
      var p = document.createElement('script');
      p.src = "https://cdn.popcash.net/pop.js"; // proveedor pop
      p.async = true; p.defer = true;
      p.onload = function(){ console.info("[ads] PopAds Listo"); };
      p.onerror = function(){ console.warn("[ads] PopAds error"); };
      document.head.appendChild(p);
    }
  }catch(e){ console.warn(e); }
})();
