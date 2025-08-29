(function () {
  var ENV=(window.__ENV||{}), BASE=(ENV.BASE||"https://ibizagirl.pics").replace(/\/+$/,"");
  var MAX=100, tries=0, MAX_TRIES=200; // 10s

  function looksLikeFile(s){
    if (typeof s!=="string") return false;
    return /[A-Za-z0-9_-]\.(webp|jpg|jpeg|png)$/i.test(s) || /^[A-Za-z0-9_-]+$/.test(s);
  }
  function collect(){
    var favored=[], others=[];
    for (var k in window){
      if (!Object.prototype.hasOwnProperty.call(window,k)) continue;
      var v=window[k];
      if (Array.isArray(v) && v.length>=10){
        var ok=0, lim=Math.min(v.length,30);
        for (var i=0;i<lim;i++){ if (looksLikeFile(v[i])) ok++; }
        if (ok >= Math.max(10, Math.floor(lim*0.6))){
          (/(PREMIUM|UNCENSORED|IBG)/i.test(k)?favored:others).push(v);
        }
      }
    }
    return favored.concat(others).flat();
  }
  function priceLabel(){
    var p=(ENV.ONESHOT_PRICE_IMAGE_EUR || "0.10");
    return String(p).replace('.', ',')+"€";
  }
  function render(){
    var all=collect();
    if(!all.length){
      if(tries++<MAX_TRIES) return setTimeout(render,50);
      console.warn("[premium-thumbs] no hay arrays tras 10s"); // seguimos igual
    }
    var files=all.slice(0,MAX);
    var grid=document.getElementById("premium-grid");
    if(!grid){ return console.warn("premium-grid no encontrado"); }
    grid.innerHTML="";
    files.forEach(function(name){
      var s=String(name||"");
      var src=/\.[a-z0-9]+$/i.test(s)?s:(s+".webp");
      var url=BASE+"/uncensored/"+src;

      var card=document.createElement("div"); card.className="card";
      var wrap=document.createElement("div"); wrap.className="thumb-wrap";
      var img=document.createElement("img"); img.loading="lazy"; img.decoding="async"; img.referrerPolicy="no-referrer";
      img.src=url; img.alt=src;

      var overlay=document.createElement("div"); overlay.className="overlay";
      overlay.innerHTML='<div class="pay"><span class="pp"></span><span class="price">'+priceLabel()+'</span></div>';
      overlay.addEventListener("click", function(e){
        e.preventDefault();
        if(!window.paypal_buy || !window.paypal_buy.Buttons){ return console.warn("paypal_buy SDK no cargado"); }
        alert("Compra individual simulada (TODO order/capture)");
      });

      wrap.appendChild(img); wrap.appendChild(overlay); card.appendChild(wrap); grid.appendChild(card);
    });
    console.info("[premium-thumbs] render ok:", files.length, "base:", BASE);
  }
  if (document.readyState==="complete"||document.readyState==="interactive") render();
  else window.addEventListener("DOMContentLoaded", render);
})();
