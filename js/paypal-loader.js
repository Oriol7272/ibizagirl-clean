(function(){
 try{
  if(window.__IBG_PP_LOADER__)return;window.__IBG_PP_LOADER__=true;
  var ENV=(window.__ENV||{});var CID=(ENV.PAYPAL_CLIENT_ID||"").trim();
  if(!CID){console.warn("[paypal] sin PAYPAL_CLIENT_ID, no cargo SDK");return;}

  function inject(src,onload){
    var s=document.createElement("script");s.src=src;s.async=true;s.defer=true;s.crossOrigin="anonymous";s.onload=onload;document.head.appendChild(s);
  }
  var urlBuy="https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)+"&components=buttons&currency=EUR&intent=capture&data-namespace=pp_buy&disable-funding=venmo";
  var hasPlans=!!((ENV.PAYPAL_PLAN_ID_MONTHLY||"").trim()||(ENV.PAYPAL_PLAN_ID_ANNUAL||"").trim());
  var urlSubs="https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)+"&components=buttons&currency=EUR&intent=subscription&vault=true&data-namespace=pp_subs";

  if(hasPlans){
    inject(urlBuy,function(){inject(urlSubs,function(){console.info("[paypal-loader] SDK listo (orders+subs)");});});
  }else{inject(urlBuy,function(){console.info("[paypal-loader] SDK listo (orders/capture)");});}
 }catch(e){console.error("[paypal-loader]",e);}
})();
