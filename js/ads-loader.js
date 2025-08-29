;(()=>{ 
  const E = window.__ENV || {};

  // ExoClick (solo si hay zone)
  if (E.EXOCLICK_ZONE) {
    // Tag estándar (sin fetch preliminar)
    const s = document.createElement('script');
    s.src = "https://a.exdynsrv.com/nativeads.js"; s.async = true;
    s.onload = ()=> console.info("[ads] ExoClick Listo");
    document.head.appendChild(s);

    const div = document.getElementById('exoclick-zone');
    if (div) div.setAttribute('data-idzone', E.EXOCLICK_ZONE);
  }

  // JuicyAds
  if (E.JUICYADS_ZONE) {
    (function(){
      const ja = document.createElement('script');
      ja.src = "https://adserver.juicyads.com/js/jads.js"; ja.async = true;
      ja.onload = ()=> console.info("[ads] JuicyAds Listo");
      document.head.appendChild(ja);

      const d = document.getElementById('juicy-zone');
      if (d){
        const s = document.createElement('ins');
        s.className = "adsbyjuicy";
        s.setAttribute('data-zone', E.JUICYADS_ZONE);
        d.appendChild(s);
      }
    })();
  }

  // PopAds
  if (String(E.POPADS_ENABLE||"false") === "true" && E.POPADS_SITE_ID) {
    const pa = document.createElement('script');
    pa.async = true;
    pa.src = "https://c1.popads.net/pop.js";
    pa.setAttribute("data-site", E.POPADS_SITE_ID);
    pa.onload = ()=> console.info("[ads] PopAds Listo");
    document.head.appendChild(pa);
  }
})();
