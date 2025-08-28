/**
 * js/env-inline.js
 * - Garantiza window.IBG_ENV y rellena IBG_ASSETS_BASE_URL si falta.
 * - Evita comillas y barra final.
 */
;(function(){
  try {
    var prior = (window.IBG_ENV && typeof window.IBG_ENV === 'object') ? window.IBG_ENV : {};
    var rawBase = (prior.IBG_ASSETS_BASE_URL || '').toString().trim().replace(/["']/g,'').replace(/\/+$/,'');
    if (!rawBase) {
      // Fallback robusto: el mismo dominio donde corre la web (ibizagirl.pics)
      rawBase = (location && location.origin) ? location.origin : 'https://ibizagirl.pics';
    }
    // Merge conservando valores previos si existían
    window.IBG_ENV = Object.assign({}, prior, {
      IBG_ASSETS_BASE_URL: rawBase
    });
    console.log('[env-inline] BASE:', window.IBG_ENV.IBG_ASSETS_BASE_URL);
  } catch (e) {
    console.warn('[env-inline] error', e);
  }
})();
