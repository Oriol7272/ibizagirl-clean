(function(){
  const BASE = (window.__ENV && window.__ENV.BASE) || "https://ibizagirl.pics";
  const PRICE = "€0.10";

  function ensureWebp(name){
    if(!name) return name;
    if(/\.webp$/i.test(name)) return name;
    return String(name).replace(/\.(jpg|jpeg|png)$/i,'') + ".webp";
  }

  // Escanea window y busca arrays/props con nombres de archivo .webp
  function harvestWebpsFrom(obj){
    const out = [];
    const pushName = (v) => {
      if(typeof v === "string" && /\S+\.(webp|jpg|jpeg|png)$/i.test(v)) out.push(ensureWebp(v));
    };

    try{
      for (const [k,v] of Object.entries(obj)){
        if(!v) continue;

        // Arrays simples de strings
        if(Array.isArray(v)){
          let hits = 0;
          for(const x of v){ if(typeof x==="string" && /\.(webp|jpg|jpeg|png)$/i.test(x)){ hits++; pushName(x); } }
          // si son objetos con .name/.file también
          if(!hits){
            for(const x of v){
              if(x && typeof x === "object"){
                pushName(x.name); pushName(x.file); pushName(x.src);
              }
            }
          }
          continue;
        }

        // Objetos con .files
        if(typeof v === "object" && Array.isArray(v.files)){
          for(const x of v.files){
            if(typeof x === "string"){ pushName(x); }
            else if(x && typeof x === "object"){ pushName(x.name); pushName(x.file); pushName(x.src); }
          }
        }

        // Un nivel más profundo: { part1:[...], part2:[...] }
        if(typeof v === "object"){
          for(const [kk,vv] of Object.entries(v)){
            if(Array.isArray(vv)){
              for(const x of vv){
                if(typeof x === "string"){ pushName(x); }
                else if(x && typeof x === "object"){ pushName(x.name); pushName(x.file); pushName(x.src); }
              }
            }
          }
        }
      }
    }catch(_e){}
    return out;
  }

  function pickPremiumNames(){
    // prioriza posibles nombres “conocidos”
    const g = window || {};
    const candidates = [];

    const hints = [
      g.contentData3, g.contentData4,
      g.PREMIUM_PART1, g.PREMIUM_PART2,
      g.premium_part1, g.premium_part2,
      g.IBG_PREMIUM_PART1, g.IBG_PREMIUM_PART2,
      g.IBG && g.IBG.premium,
      g.__IBG && g.__IBG.premium,
    ].filter(Boolean);

    for(const h of hints){ candidates.push(...harvestWebpsFrom(h)); }
    // respaldo: escaneo amplio del window (por si los “hints” no bastan)
    if(candidates.length < 50){ candidates.push(...harvestWebpsFrom(g)); }

    // normaliza, quita duplicados y limita 100
    const uniq = Array.from(new Set(candidates.filter(Boolean)));
    // intenta quedarte con los que viven bajo /uncensored/
    const sorted = uniq.sort((a,b)=>{
      const au = /uncensored/i.test(a) ? 0 : 1;
      const bu = /uncensored/i.test(b) ? 0 : 1;
      return au - bu || a.localeCompare(b);
    });
    return sorted.slice(0,100).map(n => n.replace(/^.*\//,''));
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

    // SDK one-shot (namespace: paypal_buy), se inyecta solo si hay client-id
    if(window.paypal_buy && paypal_buy.Buttons){
      try{
        paypal_buy.Buttons({
          style:{layout:'horizontal',color:'gold',shape:'pill',label:'paypal'},
          createOrder: function(data, actions){
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
      console.warn("paypal_buy SDK no cargado (sin PAYPAL_CLIENT_ID)");
    }
  }

  if(document.readyState !== "loading") render();
  else document.addEventListener("DOMContentLoaded", render);
})();
