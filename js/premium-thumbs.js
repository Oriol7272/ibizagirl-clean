(function(){
  var BASE = (window.__ENV && window.__ENV.BASE) || "https://ibizagirl.pics";
  var GRID = document.getElementById("premium-grid");
  var PRICE_IMG = parseFloat((window.__ENV && window.__ENV.PAYPAL_ONESHOT_PRICE_EUR_IMAGE) || "0.10") || 0.10;

  // 1) Intentos explícitos
  var lists = [];
  if (Array.isArray(window.IBG_PREMIUM_P1)) lists.push(window.IBG_PREMIUM_P1);
  if (Array.isArray(window.IBG_PREMIUM_P2)) lists.push(window.IBG_PREMIUM_P2);
  if (Array.isArray(window.PREMIUM_P1))     lists.push(window.PREMIUM_P1);
  if (Array.isArray(window.PREMIUM_P2))     lists.push(window.PREMIUM_P2);
  if (Array.isArray(window.IBG_PREMIUM_PART1)) lists.push(window.IBG_PREMIUM_PART1);
  if (Array.isArray(window.IBG_PREMIUM_PART2)) lists.push(window.IBG_PREMIUM_PART2);

  // 2) Fallback: escanear globals con arrays de nombres .webp
  if (lists.length === 0) {
    try {
      for (var k in window) {
        if (!Object.prototype.hasOwnProperty.call(window, k)) continue;
        var v = window[k];
        if (Array.isArray(v) && v.length && typeof v[0] === "string") {
          var hit = 0;
          for (var i=0; i<Math.min(5, v.length); i++){
            if (/\.(webp|jpg|jpeg|png)$/i.test(v[i])) hit++;
          }
          if (hit >= 3) lists.push(v);
        }
      }
    } catch(e){}
  }

  var all = [];
  lists.forEach(function(arr){ all = all.concat(arr); });
  all = all.slice(0, 100);

  console.log("[premium-thumbs] render:", all.length, "base:", BASE);
  if (!GRID) { console.warn("premium-grid no encontrado"); return; }
  GRID.innerHTML = "";

  function imgUrl(name){
    var n = name.endsWith(".webp") ? name : (name + ".webp");
    return BASE.replace(/\/+$/,'') + "/uncensored/" + n;
  }

  function ensureSDK(cb){
    if (window.paypal && window.paypal.Buttons){ cb(); return; }
    var tries = 0;
    var iv = setInterval(function(){
      if (window.paypal && window.paypal.Buttons){ clearInterval(iv); cb(); }
      if (++tries > 100) clearInterval(iv);
    }, 100);
  }

  all.forEach(function(name, idx){
    var card = document.createElement("article");
    card.className = "card locked";

    var img = document.createElement("img");
    img.className = "thumb";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = imgUrl(name);
    img.alt = "HD · Uncensored";
    card.appendChild(img);

    var badge = document.createElement("div");
    badge.className = "badge";
    badge.textContent = "€ " + PRICE_IMG.toFixed(2);
    card.appendChild(badge);

    var label = document.createElement("div");
    label.className = "label";
    label.textContent = "HD · Uncensored";
    card.appendChild(label);

    var act = document.createElement("div");
    act.className = "actions";
    var holder = document.createElement("div");
    holder.id = "pp-buy-" + idx;
    act.appendChild(holder);
    card.appendChild(act);

    GRID.appendChild(card);

    if (window.__ENV && window.__ENV.PAYPAL_CLIENT_ID) {
      ensureSDK(function(){
        try{
          window.paypal.Buttons({
            style:{ layout:"horizontal", color:"gold", shape:"pill", height: 32 },
            createOrder: function(_, actions){
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
                alert("¡Gracias! Acceso desbloqueado a: " + name);
              });
            }
          }).render("#"+holder.id);
        }catch(e){ console.error("paypal_buy render error", e); }
      });
    } else {
      var b = document.createElement("button");
      b.className = "btn";
      b.textContent = "Comprar";
      b.onclick = function(){ alert("Configura PAYPAL_CLIENT_ID en Vercel para habilitar PayPal."); };
      holder.appendChild(b);
    }
  });
})();
