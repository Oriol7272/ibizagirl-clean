(function(){
  var ENV=window.__ENV||{};

  // ExoClick
  if (ENV.EXOCLICK_ZONE){
    var s=document.createElement('script');
    s.src='https://a.exdynsrv.com/nativeads.js'; s.async=true;
    s.onload=function(){ try{ window.AdProvider && window.AdProvider.init && window.AdProvider.init({idzone:ENV.EXOCLICK_ZONE}); console.info('[ads] ExoClick Listo'); }catch(e){ console.warn('[ads] ExoClick fallback', e); } };
    document.head.appendChild(s);
  }

  // JuicyAds
  if (ENV.JUICYADS_ZONE){
    var j=document.createElement('script'); j.src='https://jsc.adskeeper.com/u/ja.js'; j.async=true;
    j.onload=function(){ console.info('[ads] JuicyAds Listo'); };
    document.head.appendChild(j);
  }

  // PopAds
  if ((ENV.POPADS_ENABLE||'').toString()==='true' && ENV.POPADS_SITE_ID){
    var p=document.createElement('script');
    p.src='https://popads.net/pop.js'; p.async=true; p.setAttribute('data-site', ENV.POPADS_SITE_ID);
    p.onload=function(){ console.info('[ads] PopAds Listo'); };
    document.head.appendChild(p);
  }
})();
