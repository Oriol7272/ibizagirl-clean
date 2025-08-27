(function(){
  const env = (window.IBG_ENV||{});
  const cid = env.PAYPAL_CLIENT_ID || env.paypal_client_id || '';
  const cur = env.PAYPAL_CURRENCY || 'EUR';
  const head = document.head || document.getElementsByTagName('head')[0];

  function addSDK(url, id){
    if(document.getElementById(id)) return;
    const s=document.createElement('script'); s.id=id; s.src=url; s.async=true;
    s.onload=()=>console.log('[paypal-init] SDK cargado:', url);
    s.onerror=()=>console.warn('[paypal-init] error SDK', url);
    head.appendChild(s);
  }

  if(!cid || cid.length < 6){
    console.warn('[paypal-init] PAYPAL_CLIENT_ID ausente; /js/env.js debe exponer window.IBG_ENV.PAYPAL_CLIENT_ID');
  }else{
    const base=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(cid)}&components=buttons&currency=${encodeURIComponent(cur)}`;
    addSDK(base + '&intent=subscription&vault=true','pp-sdk-subs'); // suscripciones
    addSDK(base + '&intent=capture','pp-sdk-pay');                  // pagos sueltos
  }
  window.paypal_subs = window.paypal_subs || window.paypal;
  window.paypal_pay  = window.paypal_pay  || window.paypal;
  console.log('[paypal-init] listo (namespaces: paypal_subs / paypal_pay)');
})();
