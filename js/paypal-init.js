/**
 * paypal-init.js
 * - Publica window.PAY con planes/precios desde globals generadas por /js/env.js
 * - Carga 2 SDK PayPal con namespaces:
 *     - paypal_subs  -> intent=subscription & vault=true (solo suscripciones)
 *     - paypal_pay   -> intent=capture (pagos sueltos / packs / lifetime)
 */
(function () {
  const asNum = (v, d=0) => {
    const n = Number(String(v||'').replace(',', '.'));
    return Number.isFinite(n) ? n : d;
  };

  const cfg = {
    clientId: (typeof window.PAYPAL_CLIENT_ID !== 'undefined' ? window.PAYPAL_CLIENT_ID : '') || '',
    planMonthly: window.PAYPAL_PLAN_MONTHLY_1499 || '',
    planAnnual:  window.PAYPAL_PLAN_ANNUAL_4999  || '',
    priceImage:  asNum(window.PAYPAL_ONESHOT_PRICE_EUR_IMAGE,   0.10),
    priceVideo:  asNum(window.PAYPAL_ONESHOT_PRICE_EUR_VIDEO,   0.30),
    priceLife:   asNum(window.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME,100.00),
    pack10img:   asNum(window.PAYPAL_PACK10_IMAGES_EUR,          0.80),
    pack5vid:    asNum(window.PAYPAL_PACK5_VIDEOS_EUR,           1.00),
    currency: 'EUR'
  };

  // Exponer mapping uniforme para el resto de scripts
  window.PAY = Object.freeze({
    CLIENT_ID: cfg.clientId,
    PLAN_MONTHLY: cfg.planMonthly,
    PLAN_ANNUAL:  cfg.planAnnual,
    PRICE_IMAGE_EUR: cfg.priceImage,
    PRICE_VIDEO_EUR: cfg.priceVideo,
    PRICE_LIFETIME_EUR: cfg.priceLife,
    PACK10_IMAGES_EUR: cfg.pack10img,
    PACK5_VIDEOS_EUR:  cfg.pack5vid,
    CURRENCY: cfg.currency
  });

  function loadSdk({ intent, namespace, extra='' }) {
    if (!cfg.clientId) {
      console.warn('[paypal-init] PAYPAL_CLIENT_ID vacío; no cargo SDK');
      return;
    }
    if (window[namespace]) return; // ya cargado

    const url = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(cfg.clientId)}&intent=${intent}&components=buttons&currency=${cfg.currency}${extra}`;
    const s = document.createElement('script');
    s.src = url;
    s.async = true;
    s.dataset.namespace = namespace;
    s.onload = () => console.log('[paypal-init] SDK cargado:', url);
    s.onerror = () => console.error('[paypal-init] ERROR cargando SDK:', url);
    document.head.appendChild(s);
  }

  // Cargar ambos SDKs (suscripciones / pagos)
  loadSdk({ intent:'subscription', namespace:'paypal_subs', extra:'&vault=true' });
  loadSdk({ intent:'capture',      namespace:'paypal_pay' });

  console.log('[paypal-init] listo (namespaces: paypal_subs / paypal_pay)');
})();
