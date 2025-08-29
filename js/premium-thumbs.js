(function () {
  try {
    var ENV  = (window.__ENV||{});
    var BASE = (ENV.BASE||"https://ibizagirl-assets.s3.eu-north-1.amazonaws.com").replace(/\/+$/,"");
    var PRICE = String(ENV.ONESHOT_PRICE_IMAGE_EUR||"0.10");

    // Recolecta arrays globales IBG_PREMIUM*
    var all = [];
    for (var k in window) {
      if (Object.prototype.hasOwnProperty.call(window,k) &&
          /^IBG_PREMIUM/i.test(k) &&
          Array.isArray(window[k])) {
        all = all.concat(window[k]);
      }
    }
    var files = all.slice(0, 100);
    var grid = document.getElementById("premium-grid");
    if (!grid) { console.warn("premium-grid no encontrado"); return; }
    grid.innerHTML = "";

    files.forEach(function(name, idx){
      var src = (typeof name === "string" && name.endsWith(".webp")) ? name : (String(name||"") + ".webp");
      var url = BASE + "/uncensored/" + src;

      var card = document.createElement("div");
      card.className = "card";

      var wrap = document.createElement("div");
      wrap.className = "thumb-wrap";

      var img = document.createElement("img");
      img.loading = "lazy"; img.decoding = "async"; img.referrerPolicy = "no-referrer";
      img.src = url; img.alt = src;

      var overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.innerHTML = '<div class="pay"><span class="pp"></span><span class="price">'+PRICE.replace('.',',')+'€</span></div>';

      // Contenedor para PayPal button inline
      var btnHost = document.createElement("div");
      btnHost.style.display="none";
      btnHost.style.marginTop="6px";
      btnHost.id = "pphost-"+idx;

      overlay.addEventListener("click", function(e){
        e.preventDefault();

        if (!window.paypal_buy || !window.paypal_buy.Buttons){
          console.warn("paypal_buy SDK no cargado"); return;
        }
        btnHost.style.display="block";

        // Render del botón (client-side: create + capture)
        window.paypal_buy.Buttons({
          style:{ layout:'horizontal', height:35, tagline:false },
          createOrder: function(data, actions){
            return actions.order.create({
              purchase_units: [{
                description: src,
                amount: { currency_code: "EUR", value: PRICE }
              }],
              intent: "CAPTURE"
            });
          },
          onApprove: function(data, actions){
            return actions.order.capture().then(function(details){
              alert("✅ Compra completada: " + details.id);
            });
          },
          onError: function(err){
            console.error("PayPal error", err);
            alert("Error con PayPal, inténtalo de nuevo.");
          }
        }).render(btnHost);
      });

      wrap.appendChild(img);
      wrap.appendChild(overlay);
      card.appendChild(wrap);
      card.appendChild(btnHost);
      grid.appendChild(card);
    });

    console.info("[premium-thumbs] render ok:", files.length, "base:", BASE);
  } catch (e) {
    console.error("[premium-thumbs] error", e);
  }
})();
