;(()=>{ 
  const E = window.__ENV || {};

  // listeners delegados
  document.addEventListener('click', (ev)=>{
    const el = ev.target.closest('[data-pp-buy],[data-pp-pack],[data-pp-sub],[data-pp-lifetime]');
    if (!el) return;

    if (!window.IBGPay) { alert("PayPal aún no está listo."); return; }

    // Compra simple con amount
    if (el.hasAttribute('data-pp-buy')) {
      ev.preventDefault();
      const v = el.getAttribute('data-amount') || E.ONESHOT_PRICE_IMAGE_EUR || "0.10";
      const label = el.getAttribute('data-label') || "Compra IBG";
      window.IBGPay.openBuy({ value:v, label, metadata:{button:"buy"} });
      return;
    }

    // Pack (mismo flujo de buy, pero etiqueta distinta/importe del data-amount)
    if (el.hasAttribute('data-pp-pack')) {
      ev.preventDefault();
      const v = el.getAttribute('data-amount') || "1.99";
      const label = el.getAttribute('data-label') || "Pack IBG";
      window.IBGPay.openBuy({ value:v, label, metadata:{button:"pack"} });
      return;
    }

    // Suscripción (monthly/annual)
    if (el.hasAttribute('data-pp-sub')) {
      ev.preventDefault();
      const plan = el.getAttribute('data-plan') || "";
      const label = el.getAttribute('data-label') || "Suscripción";
      if (!plan) { alert("Plan no configurado"); return; }
      window.IBGPay.openSub({ planId: plan, label });
      return;
    }

    // Lifetime
    if (el.hasAttribute('data-pp-lifetime')) {
      ev.preventDefault();
      const v = el.getAttribute('data-amount') || (E.ONESHOT_PRICE_LIFETIME_EUR || "100.00");
      window.IBGPay.openLifetime({ value:v });
      return;
    }
  });
})();
