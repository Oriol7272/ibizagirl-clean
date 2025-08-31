;(()=>{ 
  const E = window.__ENV || {};
  function host(){
    let h = document.getElementById("pp-host");
    if (h) return h;
    h = document.createElement("div");
    h.id = "pp-host";
    h.innerHTML = `
      <div style="position:fixed;inset:0;background:#0008;z-index:9998" id="pp-mask"></div>
      <div style="position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:#fff;max-width:440px;width:92vw;padding:16px;border-radius:12px;z-index:9999;box-shadow:0 10px 30px #0005">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
          <h3 id="pp-title" style="margin:0;font:600 18px/1.2 system-ui">Pago</h3>
          <button id="pp-close" style="border:0;background:#eee;padding:6px 10px;border-radius:8px;cursor:pointer">Cerrar</button>
        </div>
        <div id="pp-desc" style="margin:10px 0 12px;color:#333"></div>
        <div id="pp-mount"></div>
      </div>`;
    document.body.appendChild(h);
    h.querySelector("#pp-close").onclick = ()=> h.remove();
    h.querySelector("#pp-mask").onclick  = ()=> h.remove();
    return h;
  }
  function renderButtons(ns, mount, opts){
    var sdk = (ns==="buy" ? window.pp_buy : window.pp_subs);
    if (!sdk || !sdk.Buttons){ alert("PayPal aún no está listo. Reintenta en 1-2 s."); return false; }
    sdk.Buttons(opts).render(mount);
    return true;
  }

  function openBuy({value, label, metadata}){
    const v = String(value ?? E.ONESHOT_PRICE_IMAGE_EUR ?? "0.10");
    const h = host();
    h.querySelector("#pp-title").textContent = "Compra";
    h.querySelector("#pp-desc").textContent  = label || "Artículo IBG";
    const m = h.querySelector("#pp-mount"); m.innerHTML = "";
    const ok = renderButtons("buy", m, {
      createOrder: (data, actions)=> actions.order.create({
        purchase_units: [{
          amount: { currency_code:'EUR', value:v },
          description: (label || 'IBG item').slice(0,127),
          custom_id: metadata ? JSON.stringify(metadata).slice(0,127) : undefined
        }]
      }),
      onApprove: (data, actions)=> actions.order.capture().then((det)=>{
        console.info("[pp] capture OK", det);
        alert("Pago realizado: " + det.id); h.remove();
      }),
      onError: (err)=>{ console.error("[pp] error buy", err); alert("Error / cancelado."); }
    });
    if (!ok) h.remove();
  }

  function openSub({planId, label}){
    if (!planId){ alert("Plan no configurado"); return; }
    const h = host();
    h.querySelector("#pp-title").textContent = "Suscripción";
    h.querySelector("#pp-desc").textContent  = label || "Acceso Premium";
    const m = h.querySelector("#pp-mount"); m.innerHTML = "";
    const ok = renderButtons("subs", m, {
      createSubscription: (data, actions)=> actions.subscription.create({ plan_id: planId }),
      onApprove: (data)=>{ console.info("[pp] sub OK", data); alert("Suscripción activa: " + (data.subscriptionID||"OK")); h.remove(); },
      onError: (err)=>{ console.error("[pp] error sub", err); alert("Error / cancelado."); }
    });
    if (!ok) h.remove();
  }

  function openLifetime({value}){
    const v = String(value ?? E.ONESHOT_PRICE_LIFETIME_EUR ?? "100.00");
    return openBuy({ value:v, label:"Lifetime (sin anuncios)", metadata:{ kind:"lifetime" } });
  }

  window.IBGPay = { openBuy, openSub, openLifetime };
})();
