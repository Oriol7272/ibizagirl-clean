(function(){
  const BASE = (window.__ENV && window.__ENV.BASE) || "https://ibizagirl.pics";
  const GRID = document.getElementById("premium-grid");
  const PRICE_IMG = parseFloat((window.__ENV && window.__ENV.PAYPAL_ONESHOT_PRICE_EUR_IMAGE) || "0.10") || 0.10;

  // de los módulos content-data3/4
  const A3 = (window.IBG_PREMIUM_P1 || []); // se define en content-data3.js
  const A4 = (window.IBG_PREMIUM_P2 || []); // se define en content-data4.js
  const all = (A3.concat(A4)).slice(0, 100);

  console.log("[premium-thumbs] render:", all.length, "base:", BASE);

  if(!GRID){ console.warn("premium-grid no encontrado"); return; }
  GRID.innerHTML = "";

  function imgUrl(name){
    // todos son webp en /uncensored/
    const n = name.endsWith(".webp") ? name : (name + ".webp");
    return BASE.replace(/\/+$/,'') + "/uncensored/" + n;
  }

  function ensureSDK(cb){
    if (window.paypal && window.paypal.Buttons){ cb(); return; }
    const iv = setInterval(()=>{ if(window.paypal && window.paypal.Buttons){ clearInterval(iv); cb(); } }, 100);
    setTimeout(()=>clearInterval(iv), 10000);
  }

  all.forEach((name, i) => {
    const card = document.createElement("article");
    card.className = "card locked";

    const img = document.createElement("img");
    img.className = "thumb";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = imgUrl(name);
    img.alt = "HD · Uncensored";
    card.appendChild(img);

    const badge = document.createElement("div");
    badge.className = "badge";
    badge.textContent = "€ " + PRICE_IMG.toFixed(2);
    card.appendChild(badge);

    const label = document.createElement("div");
    label.className = "label";
    label.textContent = "HD · Uncensored";
    card.appendChild(label);

    const act = document.createElement("div");
    act.className = "actions";
    const holder = document.createElement("div");
    holder.id = "pp-buy-" + i;
    act.appendChild(holder);
    card.appendChild(act);

    GRID.appendChild(card);

    // Botón PayPal de compra única (order.capture)
    if ((window.__ENV && window.__ENV.PAYPAL_CLIENT_ID)) {
      ensureSDK(() => {
        try{
          window.paypal.Buttons({
            style:{ layout:"horizontal", color:"gold", shape:"pill", height: 32 },
            createOrder: function(data, actions){
              return actions.order.create({
                purchase_units: [{
                  description: "Imagen premium: " + name,
                  amount: { currency_code: "EUR", value: PRICE_IMG.toFixed(2) }
                }]
              });
            },
            onApprove: function(data, actions){
              return actions.order.capture().then(function(){
                card.classList.remove("locked");
                img.style.filter = "none";
                alert("¡Gracias! Acceso desbloqueado a: "+name);
              });
            }
          }).render("#"+holder.id);
        }catch(e){ console.error("paypal_buy render error", e); }
      });
    } else {
      // sin PayPal mostramos botón dummy
      const b = document.createElement("button");
      b.className = "btn";
      b.textContent = "Comprar";
      b.onclick = () => alert("Configura PAYPAL_CLIENT_ID en Vercel");
      holder.appendChild(b);
    }
  });
})();
