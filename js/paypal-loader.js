(function(){
  if (window.__PP_LOADED__) return; window.__PP_LOADED__ = true;
  var E = (window.__ENV||{}), CID = E.PAYPAL_CLIENT_ID||"";
  if (!CID){ console.warn("[paypal] sin PAYPAL_CLIENT_ID → no cargo SDK"); return; }
  var url = "https://www.paypal.com/sdk/js"
          + "?client-id="+encodeURIComponent(CID)
          + "&components=buttons"
          + "&currency=EUR"
          + "&vault=true"
          + "&intent=capture"; // UNA sola carga: compra (capture) y permite subs (vault)
  var s = document.createElement("script");
  s.src = url; s.async = true; s.defer = true; s.crossOrigin = "anonymous";
  s.onload = function(){ console.info("[paypal] SDK listo"); };
  s.onerror = function(){ console.error("[paypal] error cargando SDK capture"); };
  document.head.appendChild(s);
})();
