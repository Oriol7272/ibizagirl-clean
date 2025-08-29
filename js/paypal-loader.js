(function(){
  if (window.__IBG_PAYPAL_LOADER__) return;
  window.__IBG_PAYPAL_LOADER__ = true;

  var ENV = (window.__ENV||{});
  var CID = ENV.PAYPAL_CLIENT_ID||"";
  if (!CID) { console.error("[paypal] sin PAYPAL_CLIENT_ID"); return; }

  var url = "https://www.paypal.com/sdk/js"
    + "?client-id=" + encodeURIComponent(CID)
    + "&components=buttons,hosted-fields,marks"
    + "&currency=EUR"
    + "&intent=capture"
    + "&vault=true"; // permite subscripciones también

  var s = document.createElement("script");
  s.src = url; s.async = true; s.defer = true;
  s.onload = function(){ console.info("[paypal-loader] SDK universal listo"); };
  document.head.appendChild(s);
})();
