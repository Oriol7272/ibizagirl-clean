(function(){
  var E=window.__ENV||{};
  // EXOCLICK
  if (E.EXOCLICK_ZONE){
    var ex=document.createElement("script");
    ex.src="https://a.exdynsrv.com/ad-provider.js";
    ex.async=true;
    ex.onload=function(){
      try{
        window.adProvider = window.adProvider || {};
        // Inserta bloque display
        var s=document.createElement("script");
        s.async=true;
        s.src="https://syndication.exdynsrv.com/splash.php?idzone="+encodeURIComponent(E.EXOCLICK_ZONE);
        document.body.appendChild(s);
        console.info("[ads] ExoClick Listo");
      }catch(_){}
    };
    document.head.appendChild(ex);
  }

  // JUICYADS
  if (E.JUICYADS_ZONE){
    window.adsbyjuicy = window.adsbyjuicy || [];
    (function(){
      var ja = document.createElement('script');
      ja.src = 'https://js.juicyads.com/jads.js';
      ja.async = true;
      ja.onload = function(){ console.info("[ads] JuicyAds Listo"); };
      document.head.appendChild(ja);
    })();
  }

  // POPADS
  if ((E.POPADS_ENABLE||"").toString()==="true" && E.POPADS_SITE_ID){
    var pa=document.createElement("script");
    pa.src="https://c1.popads.net/pop.js";
    pa.async=true;
    pa.setAttribute("data-site", E.POPADS_SITE_ID);
    pa.onload=function(){ console.info("[ads] PopAds Listo"); };
    document.head.appendChild(pa);
  }
})();
