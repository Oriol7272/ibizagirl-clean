;(function(){
  const raw = {
    IBG_ASSETS_BASE_URL: (typeof process!=='undefined' && process.env && process.env.IBG_ASSETS_BASE_URL) || 'https://ibizagirl.pics',
    PAYPAL_CLIENT_ID: (typeof process!=='undefined' && process.env && process.env.PAYPAL_CLIENT_ID) || '',
    PAYPAL_PLAN_ID_MONTHLY: (process?.env?.PAYPAL_PLAN_ID_MONTHLY)||'',
    PAYPAL_PLAN_ID_ANNUAL:  (process?.env?.PAYPAL_PLAN_ID_ANNUAL)||'',
    PAYPAL_PLAN_ID_LIFETIME:(process?.env?.PAYPAL_PLAN_ID_LIFETIME)||'',
    PAYPAL_PLAN_PRICE_EUR_MONTHLY: (process?.env?.PAYPAL_PLAN_PRICE_EUR_MONTHLY)||'',
    PAYPAL_PLAN_PRICE_EUR_ANNUAL:  (process?.env?.PAYPAL_PLAN_PRICE_EUR_ANNUAL)||'',
    PAYPAL_ONESHOT_PRICE_EUR_IMAGE:(process?.env?.PAYPAL_ONESHOT_PRICE_EUR_IMAGE)||'',
  };
  const clean = Object.fromEntries(Object.entries(raw).map(([k,v])=>[k,String(v??'').trim().replace(/^"|"$/g,'')]));
  clean.IBG_ASSETS_BASE_URL = clean.IBG_ASSETS_BASE_URL.replace(/\/+$/,'');
  window.IBG_ENV = Object.freeze(clean);
  console.log('[env-inline] BASE:', window.IBG_ENV.IBG_ASSETS_BASE_URL);
})();
