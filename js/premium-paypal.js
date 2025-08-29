(function(){
 try{
  if(window.__IBG_PP_UI__)return;window.__IBG_PP_UI__=true;
  var ENV=(window.__ENV||{});
  var P_IMG=ENV.ONESHOT_PRICE_IMAGE_EUR||"0.10";
  var P_VID=ENV.ONESHOT_PRICE_VIDEO_EUR||"0.30";
  var P_P10=ENV.PACK10_IMAGES_EUR||"0.80";
  var P_P5V=ENV.PACK5_VIDEOS_EUR||"1.00";
  var P_LIFE=ENV.LIFETIME_PRICE_EUR||"100.00";
  var PLAN_M=(ENV.PAYPAL_PLAN_ID_MONTHLY||"").trim();
  var PLAN_Y=(ENV.PAYPAL_PLAN_ID_ANNUAL||"").trim();

  function host(){var h=document.getElementById("pp-modal");if(!h){h=document.createElement("div");h.id="pp-modal";h.style.cssText="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);z-index:99999";h.innerHTML='<div style="background:#121212;padding:16px;border-radius:10px"><div id="pp-mount"></div><button onclick="document.getElementById(\\'pp-modal\\').remove()">Cerrar</button></div>';document.body.appendChild(h);}return h;}
  function order(price,label){if(!window.pp_buy||!window.pp_buy.Buttons){alert("PayPal cargando…");return;}var m=host().querySelector("#pp-mount");m.innerHTML="";window.pp_buy.Buttons({createOrder:function(d,a){return a.order.create({purchase_units:[{amount:{currency_code:'EUR',value:String(price)},description:label}]});},onApprove:function(d,a){return a.order.capture().then(function(r){alert("Pago OK: "+r.id);document.getElementById("pp-modal").remove();});}}).render(m);}
  function sub(plan){if(!plan)return;if(!window.pp_subs||!window.pp_subs.Buttons){alert("PayPal subs cargando…");return;}var m=host().querySelector("#pp-mount");m.innerHTML="";window.pp_subs.Buttons({createSubscription:function(d,a){return a.subscription.create({plan_id:plan});},onApprove:function(d){alert("Subscripción OK: "+d.subscriptionID);document.getElementById("pp-modal").remove();}}).render(m);}

  // thumbs
  var g=document.getElementById("premium-grid");
  if(g){g.addEventListener("click",function(e){var o=e.target.closest(".overlay");if(!o)return;e.preventDefault();var img=o.parentNode.querySelector("img");order(P_IMG,"Imagen "+(img?img.alt:""));});}

  // packs/subs
  function bind(id,fn){var el=document.getElementById(id);if(el)el.onclick=function(e){e.preventDefault();fn();};}
  bind("btn-pack10",function(){order(P_P10,"Pack 10 imágenes");});
  bind("btn-pack5v",function(){order(P_P5V,"Pack 5 vídeos");});
  bind("btn-lifetime",function(){order(P_LIFE,"Lifetime");});
  bind("btn-month",function(){sub(PLAN_M);});
  bind("btn-year",function(){sub(PLAN_Y);});
 }catch(e){console.error("[pp-ui]",e);}
})();
