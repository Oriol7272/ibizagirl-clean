(() => {
  const CURRENCY='EUR';
  function loadSdk({intent, ns, clientId}) {
    return new Promise((resolve, reject) => {
      if (window[ns]) return resolve(window[ns]);
      const id=`pp-sdk-${ns}`;
      if (document.getElementById(id)) {
        const t=setInterval(()=>{ if(window[ns]){ clearInterval(t); resolve(window[ns]); }},50); return;
      }
      const s=document.createElement('script');
      const qp=new URLSearchParams({ 'client-id': clientId, intent, components:'buttons', currency:CURRENCY });
      if (intent==='subscription') qp.set('vault','true');
      s.id=id; s.src=`https://www.paypal.com/sdk/js?${qp}`; s.async=true; s.setAttribute('data-namespace', ns);
      s.onload=()=>resolve(window[ns]); s.onerror=reject; document.head.appendChild(s);
    });
  }
  window.__IBG_PayPal={ initAll: async(cfg)=>{
    const cid = cfg?.PAYPAL_CLIENT_ID || (window.IBG_ENV&&window.IBG_ENV.PAYPAL_CLIENT_ID);
    if(!cid) console.warn('[paypal-init] PAYPAL_CLIENT_ID ausente; /js/env.js debe exponerlo');
    const subs=await loadSdk({intent:'subscription',ns:'paypal_subs',clientId:cid});
    const pay =await loadSdk({intent:'capture',     ns:'paypal_pay', clientId:cid});
    console.log('[paypal-init] listo (namespaces: paypal_subs / paypal_pay)');
    return {subs,pay};
  }};
})();
