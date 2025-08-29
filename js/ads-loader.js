(function(){
 try{
  if(window.__IBG_ADS__)return;window.__IBG_ADS__=true;
  var ENV=(window.__ENV||{});

  function ensure(){
    var main=document.querySelector("main")||document.body;
    if(!main.querySelector(".ibg-layout")){
      main.innerHTML='<div class="ibg-layout"><aside class="sidebar" id="leftBar"></aside><div id="ibg-main">'+main.innerHTML+'</div><aside class="sidebar" id="rightBar"></aside></div>';
    }
  }
  function slot(where,id){var el=document.getElementById(where);if(!el)return;var d=document.createElement("div");d.className="ad";d.id=id;el.appendChild(d);return d;}
  ensure();

  // ExoClick
  (function(){
    var z=(ENV.EXOCLICK_ZONE||"").trim();if(!z)return;
    var s=document.createElement("script");s.src="https://a.exdynsrv.com/ad-provider.js";s.async=true;
    s.onload=function(){console.info("[ads] ExoClick OK");};
    document.head.appendChild(s);
  })();

  // JuicyAds
  (function(){
    var j=(ENV.JUICYADS_ZONE||"").trim();if(!j)return;
    slot("leftBar","ja-left");slot("rightBar","ja-right");
    var s=document.createElement("script");s.src="https://poweredby.jads.co/js/jads.js";s.async=true;
    s.onload=function(){console.info("[ads] JuicyAds OK");};
    document.head.appendChild(s);
  })();

  // PopAds
  (function(){
    if((ENV.POPADS_ENABLE||"")!=="true")return;
    var sid=(ENV.POPADS_SITE_ID||"").trim();if(!sid)return;
    var s=document.createElement("script");s.src="https://c.adsco.re/t";s.async=true;
    s.onload=function(){console.info("[ads] PopAds OK");};
    document.head.appendChild(s);
  })();

  console.info("[ads] sidebars montadas");
 }catch(e){console.error("[ads] error",e);}
})();
