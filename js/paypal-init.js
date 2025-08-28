;(function(){
  let _resolve; window.paypalReady = new Promise(r=>_resolve=r);
  async function waitEnv(){
    return new Promise((res,rej)=>{
      let n=0;(function loop(){
        const cid = window?.IBG_ENV?.PAYPAL_CLIENT_ID;
        if (cid && String(cid).trim().length>10) return res(cid);
        if (++n>400) return rej(new Error('PAYPAL_CLIENT_ID vacío'));
        setTimeout(loop,50);
      })();
    });
  }
  function loadSDK(cid){
    return new Promise((res,rej)=>{
      if (window.paypal) return res(window.paypal);
      const s=document.createElement('script');
      s.src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(cid)}&components=buttons&currency=EUR&intent=capture`;
      s.async=true; s.onload=()=> res(window.paypal); s.onerror=()=> rej(new Error('paypal sdk load error'));
      document.head.appendChild(s);
    });
  }
  (async ()=>{
    try{
      const cid = await waitEnv();
      const pp = await loadSDK(cid);
      _resolve(pp);
      console.log('[paypal-init] listo');
    }catch(e){
      console.warn('[paypal-init] error', e.message||e);
    }
  })();
})();
