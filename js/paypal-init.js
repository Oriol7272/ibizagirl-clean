(function(){
  const env = window.IBG_ENV || {};
  const cid = env.PAYPAL_CLIENT_ID;
  console.log("[paypal-init] cid len:", cid ? String(cid).length : 0);
  if(!cid){ console.warn("[paypal-init] PAYPAL_CLIENT_ID ausente; revisa js/env-inline.js"); return; }

  function loadSdk(intent, ns, extra){
    if (window[ns] && window[ns].Buttons) return;
    var s=document.createElement('script');
    s.src='https://www.paypal.com/sdk/js?client-id='+encodeURIComponent(cid)
        +'&components=buttons&currency=EUR'
        +'&intent='+intent+(intent==='subscription'?'&vault=true':'')+(extra||'');
    s.dataset.namespace=ns;
    s.async=true; s.defer=true;
    s.onload=function(){ console.log('[paypal-init] '+ns+' listo'); };
    document.head.appendChild(s);
  }
  loadSdk('subscription','paypal_subs','');
  loadSdk('capture','paypal_pay','');
})();
