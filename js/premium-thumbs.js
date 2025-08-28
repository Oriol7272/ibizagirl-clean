(function(){
  const BASE = (window.__ENV && window.__ENV.BASE) || "https://ibizagirl.pics";
  const PRICE = "€0.10";

  function ensureWebp(name){
    if(!name) return name;
    if(name.endsWith(".webp")) return name;
    return name.replace(/\.(jpg|jpeg|png)$/i,'') + ".webp";
  }
  function pickPremiumNames(){
    const g = window || {};
    // intenta detectar arrays globales
    const c3 = g.contentData3 || g.premium_part1 || g.PREMIUM_PART1 || [];
    const c4 = g.contentData4 || g.premium_part2 || g.PREMIUM_PART2 || [];
    // fallback: busca arrays con .files dentro
    const a3 = Array.isArray(c3) ? c3 : (c3.files||[]);
    const a4 = Array.isArray(c4) ? c4 : (c4.files||[]);
    let names = [...a3, ...a4].map(x => (typeof x === "string" ? x : (x.name||x.file||x.src||""))).filter(Boolean);
    // normaliza a .webp
    names = names.map(ensureWebp);
    // quita duplicados y limita 100
    return [...new Set(names)].slice(0,100);
  }

  function paypalIcon(){
    return `
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7 21h3l1-6h3.5a4.5 4.5 0 0 0 0-9H8.5L7 21zM9 7h6.5a2.5 2.5 0 0 1 0 5H10.6L9 7z"/>
      </svg>`;
  }

  function render(){
    const grid = document.getElementById("premium-grid");
    if(!grid){ console.warn("premium-grid no encontrado"); return; }
    const names = pickPremiumNames();
    console.info("[premium-thumbs] render:", names.length, "base:", BASE);

    grid.innerHTML = names.map(n=>{
      const src = `${BASE}/uncensored/${n}`;
      return `
        <article class="card" data-name="${n}">
          <img loading="lazy" src="${src}" alt="">
          <button class="price" data-buy="${n}" title="Comprar imagen">
            ${paypalIcon()} <span>${PRICE}</span>
          </button>
          <span class="pill">HD • Uncensored</span>
        </article>`;
    }).join("");

    grid.addEventListener("click", onBuy, {passive:true});
  }

  function onBuy(e){
    const btn = e.target.closest('[data-buy]');
    if(!btn) return;
    const name = btn.getAttribute('data-buy');

    // SDK one-shot (namespace: paypal_buy)
    if(window.paypal_buy && paypal_buy.Buttons){
      try{
        paypal_buy.Buttons({
          style:{layout:'horizontal',color:'gold',shape:'pill',label:'paypal'},
          createOrder: function(data, actions){
            // Nota: usa tu backend o andamiaje real si es necesario
            return actions.order.create({
              purchase_units:[{
                amount:{ currency_code:"EUR", value:"0.10" },
                description:`Image ${name}`
              }]
            });
          },
          onApprove: function(){ alert("¡Gracias! Te llegará el enlace de descarga."); }
        }).render(btn);
      }catch(err){ console.warn("paypal_buy error", err); }
    }else{
      console.warn("paypal_buy SDK no cargado");
    }
  }

  if(document.readyState !== "loading") render();
  else document.addEventListener("DOMContentLoaded", render);
})();
