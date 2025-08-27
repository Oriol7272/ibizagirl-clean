// js/paypal-init.js
(function () {
  const cfg = (window.ENV || {});
  const loaded = { subs: null, pay: null };

  function loadScript(src, attrs={}) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src^="${src.split('?')[0]}"][data-ns="${attrs["data-namespace"]||""}"]`)) {
        return resolve();
      }
      const s = document.createElement("script");
      s.src = src;
      s.type = "text/javascript";
      Object.entries(attrs).forEach(([k,v]) => s.setAttribute(k, v));
      s.onload = () => resolve();
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });
  }

  async function loadSubsSDK() {
    if (loaded.subs) return loaded.subs;
    // Intent = subscription; vault=true; solo buttons
    const url = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(cfg.PAYPAL_CLIENT_ID||"")}&intent=subscription&vault=true&components=buttons&currency=EUR`;
    await loadScript(url, {"data-namespace":"paypal_subs", "data-ns":"paypal_subs"});
    loaded.subs = true;
    return true;
  }
  async function loadPaySDK() {
    if (loaded.pay) return loaded.pay;
    // Intent = capture para pagos sueltos
    const url = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(cfg.PAYPAL_CLIENT_ID||"")}&intent=capture&components=buttons&currency=EUR`;
    await loadScript(url, {"data-namespace":"paypal_pay", "data-ns":"paypal_pay"});
    loaded.pay = true;
    return true;
  }

  window._ibgPayPal = {
    loadSubsSDK,   // usa window.paypal_subs
    loadPaySDK     // usa window.paypal_pay
  };

  console.log("[paypal-init] listo (namespaces: paypal_subs / paypal_pay)");
})();
