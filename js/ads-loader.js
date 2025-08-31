/* hardened ads-loader */
(function(){
  function ready(fn){ if(document.readyState!=="loading"){fn();} else {document.addEventListener("DOMContentLoaded", fn, {once:true});} }
  function ensure(sel){
    var el=document.querySelector(sel);
    if(!el){ el=document.createElement("div"); el.className="ad"; el.setAttribute("data-ad-slot","home-top"); document.body.prepend(el); }
    return el;
  }
  ready(function(){
    try{
      var slot=ensure("[data-ad-slot]");
      if (window.JUICYADS_SNIPPET_B64){
        try{ var html=atob(window.JUICYADS_SNIPPET_B64); var t=document.createElement("div"); t.innerHTML=html; slot.appendChild(t); }catch(e){}
      }
      // Sitios de terceros opcionales (no romper si no cargan)
    }catch(e){ console.warn("[ads] soft fail", e); }
  });
})();
