;(function(){
  var E=(window.IBG_ENV||{}), CID=E.PAYPAL_CLIENT_ID||"";
  console.log("[paypal-init] cid len:", CID.length);
  var loadingSubs=null, loadingPay=null;
  function inject(u){
    return new Promise(function(res,rej){
      if(!u) return res();
      var s=document.createElement("script"); s.src=u; s.async=true; s.onload=res; s.onerror=rej; document.head.appendChild(s);
    });
  }
  window.__load_paypal_subs=function(){
    if(loadingSubs) return loadingSubs;
    if(!CID){ console.warn("[paypal-init] PAYPAL_CLIENT_ID vacío"); return Promise.resolve(); }
    if(window.paypal) return Promise.resolve();
    var url="https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)+"&components=buttons&currency=EUR&intent=subscription&vault=true";
    loadingSubs=inject(url).then(function(){ console.log("[paypal-init] subs listo"); });
    return loadingSubs;
  };
  window.__load_paypal_pay=function(){
    if(loadingPay) return loadingPay;
    if(!CID){ console.warn("[paypal-init] PAYPAL_CLIENT_ID vacío"); return Promise.resolve(); }
    if(window.paypal) return Promise.resolve();
    var url="https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)+"&components=buttons&currency=EUR&intent=capture";
    loadingPay=inject(url).then(function(){ console.log("[paypal-init] pay listo"); });
    return loadingPay;
  };
})();
