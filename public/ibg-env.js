(function(){
  function set(k,v){ try{ window[k]=v; }catch(_){ } }
  var b = (window && window.__IBG_B64) ? window.__IBG_B64 : {};
  function dec(x){ try{ return x ? atob(x) : ''; }catch(_){ return ''; } }
  var cfg = {
    JUICYADS_ZONE:        dec(b.JUICYADS_ZONE),
    JUICYADS_SNIPPET_B64: dec(b.JUICYADS_SNIPPET_B64),
    EXOCLICK_ZONE:        dec(b.EXOCLICK_ZONE),
    EROADVERTISING_ZONE:  dec(b.EROADVERTISING_ZONE),
    POPADS_SITE_ID:       dec(b.POPADS_SITE_ID),
    POPADS_ENABLE:        dec(b.POPADS_ENABLE),
    CRISP_WEBSITE_ID:     dec(b.CRISP_WEBSITE_ID),
    IBG_ASSETS_BASE_URL:  dec(b.IBG_ASSETS_BASE_URL)
  };
  for (var k in cfg){ set(k, cfg[k]); }
  if (typeof window!=='undefined'){ window.IBG_ENV = cfg; }
})();
export {};
