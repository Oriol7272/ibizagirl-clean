;(()=>{ 
  try{
    const E  = window.__ENV||{};
    const BASE = (E.IBG_ASSETS_BASE_URL || "https://ibizagirl-assets.s3.eu-north-1.amazonaws.com").replace(/\/+$/,"");

    let all = [];
    for (const k in window){
      if (Object.prototype.hasOwnProperty.call(window,k) && /^IBG_PREMIUM/i.test(k) && Array.isArray(window[k])){
        all = all.concat(window[k]);
      }
    }
    const files = all;
    const grid = document.getElementById("premium-grid");
    if (!grid){ console.warn("[premium-thumbs] sin #premium-grid"); return; }
    grid.innerHTML = "";

    const priceChip = (E.ONESHOT_PRICE_IMAGE_EUR || "0.10");

    files.forEach((name)=>{
      const src = (typeof name==="string" && name.endsWith(".webp")) ? name : (String(name||"") + ".webp");
      const url = BASE + "/uncensored/" + src;

      const card = document.createElement("div"); card.className = "card";
      const wrap = document.createElement("div"); wrap.className = "thumb-wrap";

      const img = document.createElement("img");
      img.loading="lazy"; img.decoding="async"; img.referrerPolicy="no-referrer";
      img.src = url; img.alt = src;

      const overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.innerHTML = '<div class="pay"><span class="pp"></span><span class="price">'+ priceChip +'€</span></div>';
      overlay.addEventListener("click", (e)=>{
        e.preventDefault();
        if (!window.IBGPay){ alert("PayPal aún no está listo."); return; }
        window.IBGPay.openBuy({
          value: E.ONESHOT_PRICE_IMAGE_EUR || "0.10",
          label: "Imagen: "+src,
          metadata:{ type:"image", file:src }
        });
      });

      wrap.appendChild(img);
      wrap.appendChild(overlay);
      card.appendChild(wrap);
      grid.appendChild(card);
    });

    console.info("[premium-thumbs] render ok:", files.length, "base:", BASE);
  }catch(e){
    console.error("[premium-thumbs] error", e);
  }
})();
