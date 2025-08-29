(function(){
  try{
    var ENV = window.__ENV || {};

    // --- PopAds ---
    if (String(ENV.POPADS_ENABLE).toLowerCase()==='true' && ENV.POPADS_SITE_ID){
      var s=document.createElement('script');
      s.async=true; s.defer=true;
      s.src='https://popads.net/pop.js';
      s.onload=function(){ console.info('[ads] PopAds listo'); };
      s.onerror=function(){ console.warn('[ads] PopAds fallo de carga'); };
      document.head.appendChild(s);
    } else {
      console.info('[ads] PopAds desactivado (no vars)');
    }

    // --- ExoClick ---
    if (ENV.EXOCLICK_ZONE){
      var exo=document.createElement('script');
      exo.async=true; exo.defer=true;
      exo.src='https://a.exdynsrv.com/nativeads.js?idzone='+encodeURIComponent(ENV.EXOCLICK_ZONE);
      exo.onload=function(){ console.info('[ads] ExoClick listo'); };
      exo.onerror=function(){ console.warn('[ads] ExoClick fallo de carga'); };
      document.head.appendChild(exo);
    } else {
      console.info('[ads] ExoClick desactivado (no zone)');
    }

    // --- JuicyAds ---
    window.adsbyjuicy = window.adsbyjuicy || [];
    if (ENV.JUICYADS_ZONE){
      var ja=document.createElement('script');
      ja.async=true; ja.defer=true;
      ja.src='https://juicyads.com/js/jads.js';
      ja.onload=function(){ console.info('[ads] JuicyAds listo'); };
      ja.onerror=function(){ console.warn('[ads] JuicyAds fallo de carga'); };
      document.head.appendChild(ja);
    } else {
      console.info('[ads] JuicyAds desactivado (no zone)');
    }

  }catch(e){ console.error('[ads-loader]', e); }
})();
