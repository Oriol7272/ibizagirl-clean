(function(){
  const E = (window.__ENV||{});
  function inject(html, where){
    const box = document.querySelector(where);
    if(!box) return;
    box.innerHTML = html;
  }

  // JuicyAds snippet (si viene en base64)
  if (E.JUICYADS_SNIPPET_B64){
    try{
      const html = atob(E.JUICYADS_SNIPPET_B64);
      inject(html, "#ad-left");
    }catch(e){ console.warn("JUICYADS_SNIPPET_B64 inválido"); }
  }

  // EroAdvertising
  if (E.EROADVERTISING_SNIPPET_B64){
    try{
      const html = atob(E.EROADVERTISING_SNIPPET_B64);
      inject(html, "#ad-right");
    }catch(e){ console.warn("EROADVERTISING_SNIPPET_B64 inválido"); }
  }

  // ExoClick (si solo hay zone id, creamos un simple iframe)
  if (E.EXOCLICK_ZONE && !document.getElementById("exo-slot")){
    const html = '<iframe id="exo-slot" width="160" height="600" frameborder="0" scrolling="no" src="https://syndication.exoclick.com/ads-iframe-display.php?idzone='
      + encodeURIComponent(E.EXOCLICK_ZONE) + '"></iframe>';
    inject(html, "#ad-left");
  }

  // PopAds (si habilitado)
  if (String(E.POPADS_ENABLE).toLowerCase()==="true" && E.POPADS_SITE_ID){
    const s = document.createElement('script');
    s.src = "https://c1.popads.net/pop.js";
    s.async = true;
    s.setAttribute("data-site-id", E.POPADS_SITE_ID);
    document.head.appendChild(s);
  }

  // Crisp chat
  if (E.CRISP_WEBSITE_ID){
    window.$crisp=[];window.CRISP_WEBSITE_ID=E.CRISP_WEBSITE_ID;
    const d=document.createElement("script"); d.src="https://client.crisp.chat/l.js"; d.async=1; document.head.appendChild(d);
  }
})();
