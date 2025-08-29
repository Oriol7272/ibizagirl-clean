(function(){
  var ENV = window.__ENV||{};
  // ExoClick
  if (ENV.EXOCLICK_ZONE){
    window.exo_zones = window.exo_zones || [];
    window.exo_zones.push({idzone: ENV.EXOCLICK_ZONE});
    var exo = document.createElement('script');
    exo.src = 'https://a.exdynsrv.com/ads.js'; exo.async=true; exo.defer=true;
    exo.onload = function(){ console.info("[ads] ExoClick Listo"); };
    document.head.appendChild(exo);
  }
  // JuicyAds
  if (ENV.JUICYADS_ZONE){
    var j = document.createElement('script');
    j.src = 'https://poweredby.jads.co/js/jads.js'; j.async=true; j.defer=true;
    j.onload = function(){
      try{ window.jads_init = window.jads_init||[]; window.jads_init.push({adzone: ENV.JUICYADS_ZONE}); console.info("[ads] JuicyAds Listo"); }
      catch(e){ console.warn("[ads] JuicyAds error",e); }
    };
    j.onerror = function(){ console.warn("[ads] JuicyAds error"); };
    document.head.appendChild(j);
  }
  // PopAds
  if ((ENV.POPADS_ENABLE||"").toString().toLowerCase()==="true" && ENV.POPADS_SITE_ID){
    var p = document.createElement('script');
    p.src='//c1.popads.net/pop.js'; p.async=true; p.defer=true;
    p.onload=function(){ try{ window.popns = window.popns||{}; window.popns.siteId = ENV.POPADS_SITE_ID; console.info("[ads] PopAds Listo"); }catch(e){ console.warn("[ads] PopAds error",e); } };
    document.head.appendChild(p);
  }
})();
