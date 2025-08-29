(function(){
  var cfg=(window.__IBG&&window.__IBG.ADS)||{};
  var lifetime = localStorage.getItem('ibg_lifetime')==='true';
  if(lifetime){ return; }

  function addScript(src){
    var s=document.createElement('script');
    s.async=true;
    s.src=src;
    document.head.appendChild(s);
  }

  function addHtmlTo(elId, html){
    var el=document.getElementById(elId);
    if(!el) return;
    el.innerHTML='';
    var d=document.createElement('div');
    d.innerHTML=html;
    el.appendChild(d);
  }

  function fromB64(s){
    try{ return atob(String(s||'').trim()); }catch(e){ return ""; }
  }

  // JuicyAds
  if(cfg.JUICYADS_SNIPPET_B64){
    var htmlJuicy = fromB64(cfg.JUICYADS_SNIPPET_B64);
    if(htmlJuicy) addHtmlTo('ad-top', htmlJuicy);
  } else if(cfg.JUICYADS_ZONE){
    addScript('https://js.juicyads.com/jp.js');
  }

  // ExoClick
  if(cfg.EXOCLICK_ZONE){
    addScript('https://a.exdynsrv.com/ad-provider.js');
  }

  // EroAdvertising
  if(cfg.EROADVERTISING_SNIPPET_B64){
    var htmlEro = fromB64(cfg.EROADVERTISING_SNIPPET_B64);
    if(htmlEro) addHtmlTo('ad-inline-1', htmlEro);
  } else if(cfg.EROADVERTISING_ZONE){
    addScript('https://ads.ero-advertising.com/script.js');
  }

  // PopAds
  if(String(cfg.POPADS_ENABLE).toLowerCase()==='true' && cfg.POPADS_SITE_ID){
    addScript('https://popads.net/pop.js');
  }
})();
