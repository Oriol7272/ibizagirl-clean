;(function(){
  try {
    var prior = (window.IBG_ENV && typeof window.IBG_ENV === 'object') ? window.IBG_ENV : {};
    var rawBase = (prior.IBG_ASSETS_BASE_URL || '').toString().trim().replace(/["']/g,'').replace(/\/+$/,'');
    if (!rawBase) rawBase = (location && location.origin) ? location.origin : 'https://ibizagirl.pics';
    window.IBG_ENV = Object.assign({}, prior, { IBG_ASSETS_BASE_URL: rawBase });
    console.log('[env-inline] BASE:', window.IBG_ENV.IBG_ASSETS_BASE_URL);
  } catch(e){ console.warn('[env-inline] error', e); }
})();
