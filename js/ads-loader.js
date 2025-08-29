(function(){
  try{
    var E = (window.__ENV||{});
    var exo   = E.EXOCLICK_ZONE || "";       // ej: "5696328"
    var juicy = E.JUICYADS_ZONE || "";       // ej: "2093981" (snippet id)
    var popOk = String(E.POPADS_ENABLE||"false") === "true";
    var popId = E.POPADS_SITE_ID || "";

    // ExoClick: script oficial por idzone (sin XHR para evitar CORS)
    if (exo){
      var s1=document.createElement("script");
      s1.src="https://a.exdynsrv.com/nativeads.js"; s1.async=true; document.head.appendChild(s1);
      var cfg=document.createElement("script");
      cfg.text = "var _adb = _adb || []; _adb.push({ idzone: "+JSON.stringify(exo)+", native: 1 });";
      document.head.appendChild(cfg);
      console.info("[ads] ExoClick listo");
    }

    // JuicyAds: necesita adsbyjuicy antes de cargar
    if (juicy){
      window.adsbyjuicy = window.adsbyjuicy || [];
      var j=document.createElement("script");
      j.src="https://poweredby.jads.co/js/jads.js"; j.async=true;
      j.onerror=function(){ console.warn("[ads] JuicyAds fallo de carga"); };
      document.head.appendChild(j);
      var cfg2=document.createElement("script");
      cfg2.text="(adsbyjuicy = window.adsbyjuicy || []).push({adzone:"+JSON.stringify(juicy)+"});";
      document.head.appendChild(cfg2);
      console.info("[ads] JuicyAds listo");
    }

    // PopAds (opcional)
    if (popOk && popId){
      var p=document.createElement("script");
      p.src="https://c2.popads.net/pop.js"; p.async=true;
      p.onerror=function(){ console.warn("[ads] PopAds error"); };
      document.head.appendChild(p);
      var cfg3=document.createElement("script");
      cfg3.text="var _pop = _pop || []; _pop.push(['siteId', "+JSON.stringify(popId)+"]);";
      document.head.appendChild(cfg3);
      console.info("[ads] PopAds listo");
    }
  }catch(e){ console.error("[ads] error", e); }
})();
