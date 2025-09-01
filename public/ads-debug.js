(function () {
  function logStatus() {
    const juicy = !!window.adsbyjuicy;
    const exo = !!window.AdProvider;
    const ero = !!window.eaCtrl;
    console.log('[ADS][status] juicy:', juicy, 'exo:', exo, 'ero:', ero);
    document.querySelectorAll('ins#1100308, ins.eas6a97888e2').forEach((el, i) => {
      const r = el.getBoundingClientRect();
      console.log('[ADS][slot]', i, (el.className||el.id), Math.round(r.width)+'x'+Math.round(r.height));
    });
    if (!window.__tcfapi) console.warn('[ADS][gdpr] No hay CMP (__tcfapi). Algunas redes no sirven en UE sin consentimiento.');
  }
  setTimeout(logStatus, 500);
  setTimeout(logStatus, 3000);
  setTimeout(logStatus, 6000);
})();
