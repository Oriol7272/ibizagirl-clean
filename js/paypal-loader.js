(function(){
  if (window.__PP_SDK__) return; window.__PP_SDK__ = true;
  var ENV = window.__ENV || {};
  var CID = ENV.PAYPAL_CLIENT_ID || "";
  if (!CID){ console.warn("[paypal] sin PAYPAL_CLIENT_ID, no cargo SDKs"); return; }

  function load(url, cb){
    var s = document.createElement("script");
    s.src = url; s.async = true; s.defer = true;
    s.onload = function(){ try{ cb && cb(); }catch(e){ console.error(e); } };
    s.onerror = function(e){ console.error("[paypal] Error cargando SDK", e); };
    document.head.appendChild(s);
  }

  // Un solo SDK: 'vault=true' habilita suscripciones; Buttons sirve para order o subscription.
  var url = "https://www.paypal.com/sdk/js"
          + "?client-id="+encodeURIComponent(CID)
          + "&components=buttons"
          + "&currency=EUR"
          + "&vault=true";
  load(url, function(){ console.info("[paypal-loader] SDK listo (vault=true)"); });
})();
