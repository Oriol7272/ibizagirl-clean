(function(){
  var ENV = (window.__ENV||{});
  var Z_EXO   = (ENV.EXOCLICK_ZONE||"").trim();
  var Z_JUICY = (ENV.JUICYADS_ZONE||"").trim();
  var POP_EN  = String(ENV.POPADS_ENABLE||"").toLowerCase() === "true";
  var POP_ID  = (ENV.POPADS_SITE_ID||"").trim();

  function ensureSidebars(){
    if (document.getElementById("ads-left") || document.getElementById("ads-right")) return;

    var css = document.createElement("style");
    css.textContent = `
      .ads-sidebar{position:fixed; top:80px; width:160px; z-index:10;}
      #ads-left{left:0;}
      #ads-right{right:0;}
      .ads-slot{margin-bottom:12px; width:160px; min-height:600px; display:flex; justify-content:center; align-items:center; background:transparent;}
      .ads-slot iframe{border:0; width:160px; height:600px;}
      @media (max-width:1200px){ .ads-sidebar{display:none;} }
    `;
    document.head.appendChild(css);

    var L = document.createElement("div");
    L.id = "ads-left"; L.className = "ads-sidebar";
    var R = document.createElement("div");
    R.id = "ads-right"; R.className = "ads-sidebar";

    document.body.appendChild(L);
    document.body.appendChild(R);
  }

  function addIframe(container, src){
    var slot = document.createElement("div");
    slot.className = "ads-slot";
    var ifr = document.createElement("iframe");
    ifr.referrerPolicy = "no-referrer";
    ifr.loading = "lazy";
    ifr.src = src;
    slot.appendChild(ifr);
    container.appendChild(slot);
  }

  function mount(){
    ensureSidebars();
    var left  = document.getElementById("ads-left");
    var right = document.getElementById("ads-right");

    if (Z_EXO) {
      var exoSrc = "https://syndication.exdynsrv.com/ads-iframe-display.php?idzone="+encodeURIComponent(Z_EXO);
      addIframe(left,  exoSrc);
      addIframe(right, exoSrc);
      console.info("[ads] ExoClick OK");
    }

    if (Z_JUICY) {
      var juicySrc = "https://www.juicyads.com/inv/iframe.php?adzone="+encodeURIComponent(Z_JUICY);
      addIframe(left,  juicySrc);
      addIframe(right, juicySrc);
      console.info("[ads] JuicyAds OK");
    }

    if (POP_EN && POP_ID){
      var s = document.createElement("script");
      s.src = "https://c1.popads.net/pop.js";
      s.async = true; s.defer = true;
      s.setAttribute("data-site", POP_ID);
      s.onload = function(){ console.info("[ads] PopAds OK"); };
      document.head.appendChild(s);
    }

    console.info("[ads] sidebars montadas");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
