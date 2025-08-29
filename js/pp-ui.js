;(()=>{ // UI y acciones PayPal (usa SDK ya cargado en window.pp)
  const E = window.__ENV || {};
  const fmt = (n)=> (Number(n).toFixed(2));

  // --- Modal reutilizable ---
  function ensureHost(){
    let host = document.getElementById("pp-host");
    if (host) return host;
    host = document.createElement("div");
    host.id = "pp-host";
    host.innerHTML = `
      <div id="pp-backdrop" style="position:fixed;inset:0;background:#0008;z-index:9998"></div>
      <div id="pp-modal" style="position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);
          background:#fff;max-width:420px;width:90vw;padding:16px;border-radius:12px;z-index:9999;box-shadow:0 10px 30px #0005">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
          <h3 id="pp-title" style="margin:0;font:600 18px/1.2 system-ui">Pago</h3>
          <button id="pp-close" style="border:0;background:#eee;padding:6px 10px;border-radius:8px;cursor:pointer">Cerrar</button>
        </div>
        <div id="pp-desc" style="margin:10px 0 12px;color:#333"></div>
        <div id="pp-mount"></div>
      </div>`;
    document.body.appendChild(host);
    host.querySelector('#pp-close').onclick = ()=> host.remove();
    host.querySelector('#pp-backdrop').onclick = ()=> host.remove();
    return host;
  }

  function renderButtons(mount, opts){
    // Necesita window.pp (único SDK con vault=true)
    if (!window.pp || !window.pp.Buttons) {
      alert("PayPal aún no está listo. Reintenta en 1-2 s.");
      return false;
    }
    window.pp.Buttons(opts).render(mount);
    return true;
  }

  // --- Compra puntual (imagen / vídeo / pack) ---
  function openBuy({value, label, metadata}){
    const v = String(value ?? E.ONESHOT_PRICE_IMAGE_EUR ?? "0.10");
    const host = ensureHost();
    host.querySelector('#pp-title').textContent = "Compra";
    host.querySelector('#pp-desc').textContent = label || "Artículo IBG";
    const mount = host.querySelector('#pp-mount'); mount.innerHTML = "";
    const ok = renderButtons(mount, {
      createOrder: (data, actions)=> actions.order.create({
        purchase_units: [{
          amount: { currency_code: 'EUR', value: v },
          description: (label || 'IBG item').slice(0,127),
          custom_id: metadata ? JSON.stringify(metadata).slice(0,127) : undefined
        }]
      }),
      onApprove: (data, actions)=> actions.order.capture().then((det)=>{
        console.info("[pp] capture OK", det);
        alert("Pago realizado: " + det.id);
        host.remove();
      }),
      onError: (err)=> { console.error("[pp] error buy", err); alert("Error o cancelación del pago."); }
    });
    if (!ok) host.remove();
  }

  // --- Suscripción (monthly/annual) ---
  function openSub({planId, label}){
    if (!planId) { alert("Plan no configurado"); return; }
    const host = ensureHost();
    host.querySelector('#pp-title').textContent = "Suscripción";
    host.querySelector('#pp-desc').textContent = label || "Acceso Premium";
    const mount = host.querySelector('#pp-mount'); mount.innerHTML = "";
    const ok = renderButtons(mount, {
      createSubscription: (data, actions)=> actions.subscription.create({ plan_id: planId }),
      onApprove: (data)=> { console.info("[pp] sub OK", data); alert("Suscripción activa: " + (data.subscriptionID||"OK")); host.remove(); },
      onError: (err)=> { console.error("[pp] error sub", err); alert("Error o cancelación de suscripción."); }
    });
    if (!ok) host.remove();
  }

  // --- Lifetime (pago único “vitalicio”) ---
  function openLifetime({value}){
    const v = String(value ?? E.ONESHOT_PRICE_LIFETIME_EUR ?? "100.00");
    return openBuy({ value: v, label: "Lifetime", metadata: { kind:"lifetime" } });
  }

  // Exponer API mínima
  window.IBGPay = { openBuy, openSub, openLifetime };
})();
