// Reemplaza por completo el archivo
(function () {
  const cfg = (window.ENV || {});
  const clientId = cfg.PAYPAL_CLIENT_ID || "";
  if (!clientId) {
    console.warn("[paypal-init] client-id vacío: no cargo SDK");
    return;
  }

  // ¿Tenemos planes para suscripción?
  const hasMonthly = !!(cfg.PAYPAL_PLAN_MONTHLY_1499 && String(cfg.PAYPAL_PLAN_MONTHLY_1499).trim());
  const hasAnnual  = !!(cfg.PAYPAL_PLAN_ANNUAL_4999  && String(cfg.PAYPAL_PLAN_ANNUAL_4999).trim());
  const isSubscriptions = hasMonthly || hasAnnual;

  function ensureScriptOnce(url) {
    if ([...document.scripts].some(s => s.src && s.src.includes("www.paypal.com/sdk/js"))) {
      return;
    }
    const s = document.createElement("script");
    s.src = url;
    s.async = true;
    s.onload = () => console.log("[paypal-init] SDK cargado:", url);
    s.onerror = (e) => console.error("[paypal-init] error cargando SDK:", e, url);
    document.head.appendChild(s);
  }

  if (isSubscriptions) {
    // SUSCRIPCIONES: sin currency, con vault=true
    const params = new URLSearchParams({
      "client-id": clientId,
      intent: "subscription",
      vault: "true",
      components: "buttons",
    });
    const url = `https://www.paypal.com/sdk/js?${params.toString()}`;
    console.log("[paypal-init] suscripciones, URL SDK =", url);
    ensureScriptOnce(url);
  } else {
    // PAGOS SUELTOS: capture + currency=EUR
    const params = new URLSearchParams({
      "client-id": clientId,
      intent: "capture",
      currency: "EUR",
      components: "buttons",
    });
    const url = `https://www.paypal.com/sdk/js?${params.toString()}`;
    console.log("[paypal-init] pagos sueltos, URL SDK =", url);
    ensureScriptOnce(url);
  }
})();
