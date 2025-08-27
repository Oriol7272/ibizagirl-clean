(function () {
  const cfg = (window.ENV || {});
  const log = (...a)=>console.log("[premium-paypal]", ...a);
  const err = (...a)=>console.error("[premium-paypal]", ...a);

  const $ = (sel)=>document.querySelector(sel);

  function waitForPayPal(maxMs=20000){
    return new Promise((resolve,reject)=>{
      if (window.paypal) return resolve(window.paypal);
      const t0 = Date.now();
      const iv = setInterval(()=>{
        if (window.paypal){ clearInterval(iv); resolve(window.paypal); }
        else if (Date.now()-t0>maxMs){ clearInterval(iv); reject(new Error("paypal SDK no cargó")); }
      }, 150);
    });
  }

  function showStatus(id, msg, ok=true){
    const el = $(`#status-${id}`);
    if (el){ el.textContent = msg; el.style.color = ok ? "#1a7f37" : "#b00020"; }
  }

  function renderSubscription(id, planId){
    if (!planId) return;
    const mountSel = `#btn-${id}`;
    paypal.Buttons({
      style: { layout:"vertical", label:"subscribe", shape:"pill" },
      createSubscription: (_, actions) => {
        return actions.subscription.create({ plan_id: planId });
      },
      onApprove: (data) => {
        log(`sub ${id} OK`, data);
        showStatus(id, "Suscripción activada ✔");
      },
      onError: (e) => {
        err(`sub ${id} error`, e);
        showStatus(id, "Error al suscribirse", false);
      }
    }).render(mountSel).catch(e=>err("render sub", id, e));
  }

  function renderOneshot(id, amount, description){
    if (!amount) return;
    const mountSel = `#btn-${id}`;
    paypal.Buttons({
      style: { layout:"vertical", label:"pay", shape:"pill" },
      createOrder: (_, actions) => {
        return actions.order.create({
          purchase_units: [{
            description: description || id,
            amount: { currency_code: "EUR", value: String(amount) }
          }]
        });
      },
      onApprove: async (data, actions) => {
        try {
          await actions.order.capture();
          log(`oneshot ${id} OK`, data);
          showStatus(id, "Pago completado ✔");
        } catch (e) {
          err(`capture ${id} error`, e);
          showStatus(id, "Error al capturar el pago", false);
        }
      },
      onError: (e) => {
        err(`oneshot ${id} error`, e);
        showStatus(id, "Error en el pago", false);
      }
    }).render(mountSel).catch(e=>err("render oneshot", id, e));
  }

  async function main(){
    try {
      await waitForPayPal();
      log("paypal SDK listo");

      const monthly = (cfg.PAYPAL_PLAN_MONTHLY_1499||"").trim();
      const annual  = (cfg.PAYPAL_PLAN_ANNUAL_4999 ||"").trim();

      if (monthly) renderSubscription("monthly", monthly);
      if (annual)  renderSubscription("annual",  annual);

      renderOneshot("img",      cfg.PAYPAL_ONESHOT_PRICE_EUR_IMAGE,   "Imagen premium");
      renderOneshot("video",    cfg.PAYPAL_ONESHOT_PRICE_EUR_VIDEO,   "Vídeo premium");
      renderOneshot("lifetime", cfg.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME,"Acceso lifetime");
    } catch(e){
      err("init", e);
    }
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", main)
    : main();
})();
