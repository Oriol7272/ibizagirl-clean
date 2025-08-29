(function(){
  try{
    var ENV=(window.__ENV||{}), BASE=ENV.IBG_ASSETS_BASE_URL||"https://ibizagirl.pics";
    var files=[].concat((window.IBG_PREMIUM_P1||[]),(window.IBG_PREMIUM_P2||[]));
    var grid=document.getElementById("premium-grid")||document.body;

    function ensurePPHost(){
      var host=document.getElementById("pp-buy-host");
      if(!host){
        host=document.createElement("div");
        host.id="pp-buy-host"; host.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.6);display:grid;place-items:center;z-index:9999";
        host.innerHTML='<div style="background:#111;padding:16px;border-radius:12px;min-width:320px"><div id="pp-buy-btn"></div><div style="margin-top:12px;text-align:right"><button id="pp-buy-close">Cerrar</button></div></div>';
        document.body.appendChild(host);
        host.querySelector("#pp-buy-close").onclick=function(){ host.remove(); };
      }
      return host;
    }

    function openBuy(price,label){
      if(!window.pp_buy || !window.pp_buy.Buttons){ alert("PayPal no está listo (buy)."); return; }
      var host=ensurePPHost(), mount=host.querySelector("#pp-buy-btn"); mount.innerHTML="";
      var p = (price||ENV.PAYPAL_ONESHOT_PRICE_EUR_IMAGE||"0.10");
      window.pp_buy.Buttons({
        createOrder:function(_d, actions){
          return actions.order.create({ purchase_units:[{ amount:{ currency_code:'EUR', value:String(p) }, description: label||'IBG item' }]});
        },
        onApprove:function(d,a){ return a.order.capture().then(function(r){ alert("Pago OK: "+r.id); host.remove(); }); },
        onError:function(err){ console.error(err); alert("Pago cancelado"); host.remove(); }
      }).render(mount);
    }

    function openSub(planId){
      if(!planId) return alert("Plan vacío");
      if(!window.pp_subs || !window.pp_subs.Buttons){ alert("PayPal no está listo (subs)."); return; }
      var host=ensurePPHost(), mount=host.querySelector("#pp-buy-btn"); mount.innerHTML="";
      window.pp_subs.Buttons({
        createSubscription:function(_d, actions){ return actions.subscription.create({ plan_id: planId }); },
        onApprove:function(d){ alert("Suscripción OK: "+d.subscriptionID); host.remove(); },
        onError:function(err){ console.error(err); alert("Error suscripción"); host.remove(); }
      }).render(mount);
    }

    // thumbnails
    var euroChip=(ENV.PAYPAL_ONESHOT_PRICE_EUR_IMAGE||"0.10");
    files.forEach(function(name){
      var src=String(name).endsWith(".webp")?name:(String(name||"")+".webp");
      var url=BASE+"/uncensored/"+src;
      var card=document.createElement("div"); card.className="card";
      var wrap=document.createElement("div"); wrap.className="thumb-wrap";
      var img=document.createElement("img"); img.loading="lazy"; img.decoding="async"; img.referrerPolicy="no-referrer"; img.src=url; img.alt=src;
      var overlay=document.createElement("div"); overlay.className="overlay";
      overlay.innerHTML='<div class="pay"><span class="pp"></span><span class="price">'+euroChip+'</span></div>';
      overlay.addEventListener("click", function(e){ e.preventDefault(); openBuy(ENV.PAYPAL_ONESHOT_PRICE_EUR_IMAGE, "Imagen: "+src); });
      wrap.appendChild(img); wrap.appendChild(overlay); card.appendChild(wrap); grid.appendChild(card);
    });

    // packs y lifetime
    var byId=function(id){ return document.getElementById(id); };
    var pairs=[
      ["btn-pack-images-10", ENV.PAYPAL_ONESHOT_PACK10_IMAGES_EUR, "Pack 10 imágenes"],
      ["btn-pack-videos-5",  ENV.PAYPAL_ONESHOT_PACK5_VIDEOS_EUR,  "Pack 5 vídeos"],
      ["btn-lifetime",       ENV.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME,"Acceso lifetime"]
    ];
    pairs.forEach(function(p){ var el=byId(p[0]); if(el){ el.addEventListener("click", function(){ openBuy(p[1], p[2]); }); }});

    // suscripciones
    if (byId("btn-month")) byId("btn-month").addEventListener("click", function(){ openSub(ENV.PAYPAL_PLAN_MONTHLY_1499); });
    if (byId("btn-year"))  byId("btn-year").addEventListener("click",  function(){ openSub(ENV.PAYPAL_PLAN_ANNUAL_4999 ); });

    console.info("[premium-thumbs] render ok:", files.length, "base:", BASE);
  } catch(e){ console.error("[premium-thumbs] error", e); }
})();

// ==== BOTONES PAGO ====
(function(){
  var ENV = window.__ENV||{};
  var PRICE_IMG   = String(ENV.PAYPAL_ONESHOT_PRICE_EUR_IMAGE||'0.10');
  var PRICE_VID   = String(ENV.PAYPAL_ONESHOT_PRICE_EUR_VIDEO||'0.30');
  var PRICE_LIFE  = String(ENV.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME||'100.00');
  var PACK10_IMG  = String(ENV.PAYPAL_ONESHOT_PACK10_IMAGES_EUR||'0.80');
  var PACK5_VID   = String(ENV.PAYPAL_ONESHOT_PACK5_VIDEOS_EUR||'1.00');
  var PLAN_M      = ENV.PAYPAL_PLAN_MONTHLY_1499||'';
  var PLAN_A      = ENV.PAYPAL_PLAN_ANNUAL_4999||'';

  function ensureModal(){
    var host=document.getElementById("pp-modal");
    if (host) return host;
    host=document.createElement("div");
    host.id="pp-modal";
    host.innerHTML='<div style="position:fixed;inset:0;display:grid;place-items:center;background:#0008;z-index:9999">'+
      '<div style="background:#111;padding:16px;border-radius:12px;width:min(420px,90vw)">'+
      '<div id="pp-mount"></div><div style="text-align:right;margin-top:10px">'+
      '<button id="pp-close" style="background:#333;color:#fff;border:0;padding:6px 10px;border-radius:8px">Cerrar</button>'+
      '</div></div></div>';
    document.body.appendChild(host);
    host.querySelector('#pp-close').onclick=function(){ host.remove(); };
    return host;
  }

  function openBuy(value, label){
    if (!window.pp_buy || !window.pp_buy.Buttons){ alert("PayPal (buy) no listo"); return; }
    var h=ensureModal(); var m=h.querySelector('#pp-mount'); m.innerHTML="";
    window.pp_buy.Buttons({
      createOrder: (data,actions)=>actions.order.create({
        purchase_units:[{ amount:{ currency_code:'EUR', value:String(value) }, description:label||'IBG item' }]
      }),
      onApprove: (data,actions)=>actions.order.capture().then(d=>{ alert("Pago OK: "+d.id); h.remove(); }),
      onError: (err)=>{ console.error(err); alert("Pago cancelado"); h.remove(); }
    }).render(m);
  }

  function openSub(planId){
    if (!planId){ alert("Plan no configurado"); return; }
    if (!window.pp_subs || !window.pp_subs.Buttons){ alert("PayPal (subs) no listo"); return; }
    var h=ensureModal(); var m=h.querySelector('#pp-mount'); m.innerHTML="";
    window.pp_subs.Buttons({
      createSubscription: (data,actions)=>actions.subscription.create({ plan_id: planId }),
      onApprove: (d)=>{ alert("Suscripción OK: "+d.subscriptionID); h.remove(); },
      onError: (err)=>{ console.error(err); alert("Suscripción cancelada"); h.remove(); }
    }).render(m);
  }

  // Bind global buttons si existen
  document.getElementById('btn-pack10') && document.getElementById('btn-pack10').addEventListener('click', ()=>openBuy(PACK10_IMG,'Pack 10 imágenes'));
  document.getElementById('btn-pack5v') && document.getElementById('btn-pack5v').addEventListener('click',  ()=>openBuy(PACK5_VID,'Pack 5 vídeos'));
  document.getElementById('btn-life')   && document.getElementById('btn-life').addEventListener('click',    ()=>openBuy(PRICE_LIFE,'Lifetime'));
  document.getElementById('btn-month')  && document.getElementById('btn-month').addEventListener('click',   ()=>openSub(PLAN_M));
  document.getElementById('btn-year')   && document.getElementById('btn-year').addEventListener('click',    ()=>openSub(PLAN_A));

})();
