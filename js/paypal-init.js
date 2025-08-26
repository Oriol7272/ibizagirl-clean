(function(){
  try{
    var cid = (window.ENV && window.ENV.PAYPAL_CLIENT_ID) || "";
    if(!cid){ console.error("[paypal-init] PAYPAL_CLIENT_ID vacío; no cargo SDK"); return; }
    var params = new URLSearchParams({
      "client-id": cid,
      intent: "subscription",
      currency: "EUR",
      components: "buttons"
    });
    var s=document.createElement("script");
    s.src="https://www.paypal.com/sdk/js?"+params.toString();
    s.async=true;
    s.onload=function(){ document.dispatchEvent(new Event("paypal:sdk-ready")); };
    document.head.appendChild(s);
  }catch(e){ console.error("[paypal-init] error", e); }
})();
