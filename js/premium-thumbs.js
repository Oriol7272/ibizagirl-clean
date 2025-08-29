(function () {
  var ENV=(window.__ENV||{}), BASE=(ENV.BASE||"https://ibizagirl.pics").replace(/\/+$/,"");
  var MAX=100, tries=0;

  function collect(){
    var all=[], w=window;
    for (var k in w){
      if (Object.prototype.hasOwnProperty.call(w,k) && /^IBG_PREMIUM/i.test(k) && Array.isArray(w[k])){
        all=all.concat(w[k]);
      }
    }
    return all;
  }

  function pricedLabel(){
    var p = (ENV.ONESHOT_PRICE_IMAGE_EUR || "0.10");
    return (String(p).replace('.', ',')) + "€";
  }

  function render(){
    var all = collect();
    if (!all.length && tries < 60){ // ~3s total
      tries++; return setTimeout(render, 50);
    }
    var files = all.slice(0, MAX);
    var grid = document.getElementById("premium-grid");
    if (!grid){ console.warn("premium-grid no encontrado"); return; }
    grid.innerHTML="";
    files.forEach(function(name){
      var src = (typeof name === "string" && /\.[a-z0-9]+$/i.test(name)) ? name : (String(name||"") + ".webp");
      var url = BASE + "/uncensored/" + src;

      var card = document.createElement("div"); card.className="card";
      var wrap = document.createElement("div"); wrap.className="thumb-wrap";
      var img = document.createElement("img"); img.loading="lazy"; img.decoding="async"; img.referrerPolicy="no-referrer";
      img.src=url; img.alt=src;

      var overlay=document.createElement("div"); overlay.className="overlay";
      overlay.innerHTML='<div class="pay"><span class="pp"></span><span class="price">'+pricedLabel()+'</span></div>';
      overlay.addEventListener("click", function(e){
        e.preventDefault();
        if (!window.paypal_buy || !window.paypal_buy.Buttons){ console.warn("paypal_buy SDK no cargado"); return; }
        alert("Compra individual simulada (TODO: integrar order/capture)");
      });

      wrap.appendChild(img); wrap.appendChild(overlay); card.appendChild(wrap); grid.appendChild(card);
    });
    console.info("[premium-thumbs] render ok:", files.length, "base:", BASE);
  }

  if (document.readyState === "complete" || document.readyState === "interactive"){ render(); }
  else { window.addEventListener("DOMContentLoaded", render); }
})();
