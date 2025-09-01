(function () {
  function logStatus() {
    const juicy = !!window.adsbyjuicy;
    const exo = !!window.AdProvider;
    const ero = !!window.eaCtrl;
    console.log('[ADS][status] juicy:', juicy, 'exo:', exo, 'ero:', ero, 'popads: loader inline');

    // medir si Exo y Juicy han pintado algo (ins con tamaño > 0)
    document.querySelectorAll('ins#1099637, ins.eas6a97888e2').forEach((el, i) => {
      const r = el.getBoundingClientRect();
      console.log('[ADS][slot]', i, el.className || el.id, Math.round(r.width)+'x'+Math.round(r.height));
    });

    // GDPR: si estás en UE y no tienes CMP, muchas redes no sirven fill.
    if (!window.__tcfapi) {
      console.warn('[ADS][gdpr] No hay CMP (__tcfapi). En UE varias redes no sirven sin consentimiento.');
    }
  }

  // log inicial y a los 3/6/10s
  setTimeout(logStatus, 500);
  setTimeout(logStatus, 3000);
  setTimeout(logStatus, 6000);
  setTimeout(logStatus, 10000);
})();
