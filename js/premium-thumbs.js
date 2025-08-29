(function(){
  try{
    var ENV = (window.__ENV||{});
    var BASE = ENV.BASE || "https://ibizagirl.pics";

    // Seguridad: si en content-data3/4 vienen tokens sin .webp, forzamos extensión
    var P1 = (window.IBG_PREMIUM_P1||[]).map(function(x){ return (String(x).endsWith(".webp")?String(x):String(x)+".webp"); });
    var P2 = (window.IBG_PREMIUM_P2||[]).map(function(x){ return (String(x).endsWith(".webp")?String(x):String(x)+".webp"); });
    var files = P1.concat(P2);

    function ensureHost(){
      var host = document.getElementById("pp-host");
      if (!host){
        host = document.createElement("div");
        host.id = "pp-host";
        host.innerHTML =
          '<div class="pp-backdrop" style="position:fixed;inset:0;background:#0008;z-index:9998"></div>'
        + '<div class="pp-modal" style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:9999">'
        + ' <div style="background:#111;border-radius:16px;padding:20px;min-width:320px;max-width:90vw">'
        + '   <div id="pp-mount"></div>'
        + '   <div style="text-align:right;margin-top:12px">'
        + '     <button id="pp-close" style="padding:.5rem 1rem;border-radius:8px">Cerrar</button>'
        + '   </div>'
        + ' </div>'
        + '</div>';
        document.body.appendChild(host);
        host.querySelector("#pp-close").onclick = function(){ host.remove(); };
        host.querySelector(".pp-backdrop").onclick = function(){ host.remove(); };
      }
      return host;
    }

    function payOneShot(label, price){
      if (!window.pp_buy || !window.pp_buy.Buttons){ alert("PayPal (compra) no está listo."); return; }
      var mount = ensureHost().querySelector("#pp-mount");
      mount.innerHTML = "";
      var p = String(price || ENV.ONESHOT_PRICE_IMAGE_EUR || "0.10");
      window.pp_buy.Buttons({
        createOrder: function(data, actions){
          return actions.order.create({
            purchase_units: [{ amount: { currency_code: 'EUR', value: p }, description: label }]
          });
        },
        onApprove: function(d, actions){ return actions.order.capture().then(function(rec){ alert("Pago OK: "+rec.id); mount.parentNode.parentNode.remove(); }); },
        onError: function(err){ console.error(err); alert("Pago cancelado"); mount.parentNode.parentNode.remove(); }
      }).render(mount);
    }

    function subscribe(planId){
      if (!planId){ alert("Plan no disponible"); return; }
      if (!window.pp_subs || !window.pp_subs.Buttons){ alert("PayPal (subs) no está listo."); return; }
      var mount = ensureHost().querySelector("#pp-mount");
      mount.innerHTML = "";
      window.pp_subs.Buttons({
        createSubscription: function(data, actions){ return actions.subscription.create({ plan_id: planId }); },
        onApprove: function(d){ alert("Suscripción OK: "+d.subscriptionID); mount.parentNode.parentNode.remove(); },
        onError: function(err){ console.error(err); alert("Error suscripción"); mount.parentNode.parentNode.remove(); }
      }).render(mount);
    }

    // Construir grid
    var grid = document.getElementById("premium-grid");
    if (!grid){
      grid = document.createElement("div");
      grid.id = "premium-grid";
      grid.style.display = "grid";
      grid.style.gridTemplateColumns = "repeat(auto-fill,minmax(180px,1fr))";
      grid.style.gap = "12px";
      document.body.appendChild(grid);
    }

    files.forEach(function(name){
      var url = BASE + "/uncensored/" + name;
      var card = document.createElement("div");
      card.className = "card";
      card.innerHTML =
        '<div class="thumb-wrap" style="position:relative;border-radius:12px;overflow:hidden;background:#223">'
      + '  <img src="'+url+'" alt="'+name+'" loading="lazy" decoding="async" referrerpolicy="no-referrer" style="width:100%;display:block;filter:blur(10px);transform:scale(1.05)">'
      + '  <a href="#" class="overlay" style="position:absolute;inset:0;display:flex;align-items:end;justify-content:center;padding:8px;text-decoration:none">'
      + '    <span style="background:#000c;color:#ffd;display:inline-flex;align-items:center;gap:6px;padding:.25rem .5rem;border-radius:999px;font-weight:700;">'
      + '      <span style="display:inline-block;width:18px;height:18px;background:#2d6; border-radius:999px;"></span>'
      + '      '+(ENV.ONESHOT_PRICE_IMAGE_EUR||"0.10")+
      '    </span>'
      + '  </a>'
      + '</div>';
      card.querySelector(".overlay").addEventListener("click", function(e){
        e.preventDefault(); payOneShot("Imagen: "+name, ENV.ONESHOT_PRICE_IMAGE_EUR);
      });
      grid.appendChild(card);
    });

    // Botones Packs (si existen en HTML)
    var btnP10 = document.getElementById("btn-pack-10");
    if (btnP10){
      btnP10.addEventListener("click", function(e){
        e.preventDefault(); payOneShot("Pack 10 imágenes", ENV.ONESHOT_PRICE_IMAGE_EUR);
      });
    }
    var btnP5v = document.getElementById("btn-pack-5v");
    if (btnP5v){
      btnP5v.addEventListener("click", function(e){
        e.preventDefault(); payOneShot("Pack 5 vídeos", ENV.ONESHOT_PRICE_VIDEO_EUR);
      });
    }
    var btnLife = document.getElementById("btn-lifetime");
    if (btnLife){
      btnLife.addEventListener("click", function(e){
        e.preventDefault(); payOneShot("Acceso lifetime", ENV.ONESHOT_PRICE_LIFETIME_EUR);
      });
    }

    // Suscripciones
    var btnMonth = document.getElementById("btn-month");
    if (btnMonth && (ENV.PAYPAL_PLAN_ID_MONTHLY||"")){
      btnMonth.addEventListener("click", function(e){ e.preventDefault(); subscribe(ENV.PAYPAL_PLAN_ID_MONTHLY); });
    }
    var btnYear = document.getElementById("btn-year");
    if (btnYear && (ENV.PAYPAL_PLAN_ID_ANNUAL||"")){
      btnYear.addEventListener("click", function(e){ e.preventDefault(); subscribe(ENV.PAYPAL_PLAN_ID_ANNUAL); });
    }

    console.info("[premium-thumbs] render ok:", files.length, "base:", BASE);
  }catch(e){
    console.error("[premium-thumbs] error", e);
  }
})();
