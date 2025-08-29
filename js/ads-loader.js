(function(){
  var E = (window.__ENV||{});
  function inject(id, src){
    if (!src || document.getElementById(id)) return;
    var s=document.createElement("script"); s.id=id; s.src=src; s.async=true; s.defer=true; document.head.appendChild(s);
  }

  // ExoClick (zone)
  if (E.EXOCLICK_ZONE){
    var a=document.createElement("script");
    a.async=true; a.src="https://a.exdynsrv.com/ads.js";
    document.head.appendChild(a);
    var l=document.getElementById("ad-left");  if(l){ l.innerHTML  = '<ins class="adsbyexoclick" data-zoneid="'+E.EXOCLICK_ZONE+'"></ins>'; }
    var r=document.getElementById("ad-right"); if(r){ r.innerHTML = '<ins class="adsbyexoclick" data-zoneid="'+E.EXOCLICK_ZONE+'"></ins>'; }
  }

  // JuicyAds (zone)
  if (E.JUICYADS_ZONE){
    var j=document.createElement("script");
    j.async=true; j.src="https://poweredby.jads.co/js/jads.js";
    j.onload=function(){
      try{
        window.jads.setZone(E.JUICYADS_ZONE);
        var l=document.getElementById("ad-left");  if(l){ l.innerHTML  = '<div id="jads-left"  data-jads-zone="'+E.JUICYADS_ZONE+'"></div>'; }
        var r=document.getElementById("ad-right"); if(r){ r.innerHTML = '<div id="jads-right" data-jads-zone="'+E.JUICYADS_ZONE+'"></div>'; }
      }catch(_){}
    };
    document.head.appendChild(j);
  }

  // EroAdvertising (zone)
  if (E.EROADVERTISING_ZONE){
    inject("eroadv", "https://a.realsrv.com/ad-provider.js");
    var l=document.getElementById("ad-left");  if(l){ l.innerHTML  = '<ins class="adsbyexoclick" data-zoneid="'+E.EROADVERTISING_ZONE+'"></ins>'; }
    var r=document.getElementById("ad-right"); if(r){ r.innerHTML = '<ins class="adsbyexoclick" data-zoneid="'+E.EROADVERTISING_ZONE+'"></ins>'; }
  }

  // PopAds (si está ON y site id)
  if ((String(E.POPADS_ENABLE||"false").toLowerCase()==="true") && E.POPADS_SITE_ID){
    var p=document.createElement("script");
    p.async=true;
    p.src="https://www.popads.net/pop.js";
    p.onload=function(){ try{ PopAds.setSiteId(E.POPADS_SITE_ID); }catch(_){} };
    document.head.appendChild(p);
  }
})();
