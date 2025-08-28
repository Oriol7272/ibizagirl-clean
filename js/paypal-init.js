;(function () {
  function waitForEnv(cb){
    let n=0; (function loop(){ 
      if (window.IBG_ENV && window.IBG_ENV.PAYPAL_CLIENT_ID) return cb();
      if (++n>80) { console.warn('[paypal-init] PAYPAL_CLIENT_ID vacío'); return; }
      setTimeout(loop, 50);
    })();
  }
  waitForEnv(function(){
    const env = (window.IBG_ENV||{});
    const CID = (env.PAYPAL_CLIENT_ID||'').trim();
    if (!CID) { console.warn('[paypal-init] PAYPAL_CLIENT_ID vacío'); return; }
    if (window.__paypal_sdk_loading__) return;
    window.__paypal_sdk_loading__ = true;

    const qs = new URLSearchParams({
      'client-id': CID, components: 'buttons', currency: 'EUR', vault: 'true'
    }).toString();

    window.paypalReady = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = `https://www.paypal.com/sdk/js?${qs}`;
      s.async = true;
      s.onload  = () => { console.log('[paypal-init] SDK listo'); resolve(window.paypal); };
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });
  });
})();
