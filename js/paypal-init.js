(function(){
  function readyEnv(cb){
    let tries=0;
    (function wait(){
      const env = (window.IBG_ENV||window.ENV||null);
      const cid = env && (env.PAYPAL_CLIENT_ID || env.paypal_client_id);
      if(cid && cid.length>6){ return cb(env); }
      if(++tries>60){ console.warn('[paypal-init] PAYPAL_CLIENT_ID ausente tras espera.'); return cb(env||{}); }
      setTimeout(wait,50);
    })();
  }
  function addSDK(url,id){
    if(document.getElementById(id)) return;
    const s=document.createElement('script'); s.id=id; s.src=url; s.async=true;
    s.onload=()=>console.log('[paypal-init] SDK cargado:', url);
    s.onerror=()=>console.warn('[paypal-init] error SDK', url);
    (document.head||document.body).appendChild(s);
  }
  readyEnv((env=>{
    const cid = (env&&env.PAYPAL_CLIENT_ID)||'';
    const cur = (env&&env.PAYPAL_CURRENCY)||'EUR';
    if(!cid){ console.warn('[paypal-init] PAYPAL_CLIENT_ID vacío'); }
    const base=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(cid)}&components=buttons&currency=${encodeURIComponent(cur)}`;
    addSDK(base + '&intent=subscription&vault=true','pp-sdk-subs');
    addSDK(base + '&intent=capture','pp-sdk-pay');
    window.paypal_subs = window.paypal_subs || window.paypal;
    window.paypal_pay  = window.paypal_pay  || window.paypal;
    console.log('[paypal-init] listo (namespaces: paypal_subs / paypal_pay)');
  }));
})();
