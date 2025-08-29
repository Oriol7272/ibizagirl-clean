(function(){
  if (window.__IBG_PP_LOADER__) return; window.__IBG_PP_LOADER__=true;
  var E = window.__ENV || {}; var CID = E.PAYPAL_CLIENT_ID || "";
  if (!CID){ console.warn("[paypal] PAYPAL_CLIENT_ID vacío — no cargo SDK"); return; }

  // SDK para compras one-shot (capture)
  var urlCapture = "https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)
                 + "&components=buttons&currency=EUR&intent=capture&data-namespace=pp";
  var s = document.createElement("script");
  s.id="pp-capture"; s.src=urlCapture; s.async=true; s.defer=true; s.crossOrigin="anonymous";
  s.onload = function(){ console.info("[paypal] SDK capture listo"); };
  s.onerror= function(){ console.error("[paypal] Error cargando SDK capture"); };
  document.head.appendChild(s);

  // Helper: carga bajo demanda el SDK de SUBS (si tu app no tiene Subscriptions dará 400)
  window.__loadPayPalSubsSDK = function(){
    return new Promise(function(resolve, reject){
      if (window.__IBG_PP_SUBS_LOADED__ && window.pp) return resolve(window.pp);
      var urlSubs = "https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)
                  + "&components=buttons&currency=EUR&intent=subscription&vault=true&data-namespace=pp";
      var t = document.createElement("script");
      t.id="pp-subs"; t.src=urlSubs; t.async=true; t.defer=true; t.crossOrigin="anonymous";
      t.onload  = function(){ window.__IBG_PP_SUBS_LOADED__=true; console.info("[paypal] SDK subs listo"); resolve(window.pp); };
      t.onerror = function(){ reject(new Error("No se pudo cargar el SDK de Suscripciones (¿activado en PayPal?).")); };
      document.head.appendChild(t);
    });
  };
})();
