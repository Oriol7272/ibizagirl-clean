(function(){
  var ENV=(window.__ENV||{});
  // ExoClick (zone id)
  if (ENV.EXOCLICK_ZONE){
    var s=document.createElement("script"); s.async=true; s.src="https://a.exdynsrv.com/nativeads.js"; document.head.appendChild(s);
    var ins=document.createElement("ins"); ins.className="nativeads"; ins.setAttribute("data-zoneid", ENV.EXOCLICK_ZONE);
    document.addEventListener("DOMContentLoaded", function(){ (document.body||document.documentElement).appendChild(ins); (window.AdProvider=window.AdProvider||[]).push({serve:{}}); });
    console.info("[ads] ExoClick Listo");
  }
  // JuicyAds (si hay snippet b64 lo inyecto ejecutable; si no, uso zone id)
  if (ENV.JUICYADS_SNIPPET_B64){
    try{
      var html = atob(ENV.JUICYADS_SNIPPET_B64);
      var tmp=document.createElement("div"); tmp.innerHTML=html;
      tmp.querySelectorAll("script").forEach(function(old){
        var n=document.createElement("script");
        if (old.src) n.src=old.src; else n.textContent=old.textContent;
        document.body.appendChild(n);
      });
      console.info("[ads] JuicyAds Listo");
    }catch(e){ console.warn("[ads] JuicyAds error", e); }
  } else if (ENV.JUICYADS_ZONE){
    var j=document.createElement("script"); j.src="https://poweredby.jads.co/js/jads.js"; j.async=true; document.head.appendChild(j);
    var inj=document.createElement("script"); inj.text="(adsbyjuicy=window.adsbyjuicy||[]).push({adzone:'"+ENV.JUICYADS_ZONE+"'});";
    document.body.appendChild(inj);
    console.info("[ads] JuicyAds Listo");
  }
  // PopAds
  if (String(ENV.POPADS_ENABLE).toLowerCase()==="true" && ENV.POPADS_SITE_ID){
    var paCfg=document.createElement("script"); paCfg.text="var _pop={siteId:'"+ENV.POPADS_SITE_ID+"'};";
    var pa=document.createElement("script"); pa.async=true; pa.src="https://c1.popads.net/pop.js";
    document.head.appendChild(paCfg); document.head.appendChild(pa);
    pa.onload=function(){ console.info("[ads] PopAds Listo"); };
  }
})();
