;(function(){
  function loadSDK(cid,{intent='capture',components='buttons',currency='EUR',vault=false}={}){
    return new Promise((resolve,reject)=>{
      if(!cid) return reject(new Error('PAYPAL_CLIENT_ID vacío'));
      if(window.paypal) return resolve(window.paypal);
      const s=document.createElement('script');
      const qs=new URLSearchParams({'client-id':cid,components,currency,intent,vault:String(vault)});
      s.src=`https://www.paypal.com/sdk/js?${qs.toString()}`;
      s.onload=()=>resolve(window.paypal);
      s.onerror=()=>reject(new Error('paypal sdk load error'));
      document.head.appendChild(s);
    });
  }
  async function boot(){
    await new Promise(r=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',r,{once:true}):r());
    try{
      const pp=await loadSDK(window.IBG_ENV?.PAYPAL_CLIENT_ID||'');
      window.paypalReady=Promise.resolve(pp);
      console.log('[paypal-init] listo');
    }catch(e){
      console.error('[paypal-init] error', e.message||e);
      window.paypalReady=Promise.reject(e);
    }
  }
  boot();
})();
