(function(){
  var E=window.__ENV||{};
  // ExoClick
  if (E.EXOCLICK_ZONE){
    var ins=document.createElement('ins');
    ins.className='adsbyexoclick'; ins.setAttribute('data-zoneid', String(E.EXOCLICK_ZONE));
    document.body.appendChild(ins);
    var s=document.createElement('script'); s.src='https://a.exdynsrv.com/ad-provider.js'; s.async=true;
    s.onload=function(){ try{ (AdProvider=window.AdProvider||[]).push({serve:"ad",selector:ins}); console.info("[ads] ExoClick listo"); }catch(e){} };
    document.head.appendChild(s);
  } else { console.warn("[ads] EXOCLICK_ZONE vacío"); }

  // JuicyAds
  if (E.JUICYADS_ZONE){
    var ja=document.createElement('script'); ja.src='https://poweredby.jads.co/js/jads.js'; ja.async=true;
    ja.onload=function(){ console.info("[ads] JuicyAds listo"); };
    document.head.appendChild(ja);
    var div=document.createElement('ins'); div.id='jads_ad_'+E.JUICYADS_ZONE; div.className='jads_ad'; div.setAttribute('data-adzone', String(E.JUICYADS_ZONE));
    document.body.appendChild(div);
  } else { console.warn("[ads] JUICYADS_ZONE vacío"); }

  // PopAds
  if (String(E.POPADS_ENABLE).toLowerCase()==='true' && E.POPADS_SITE_ID){
    var ps=document.createElement('script'); ps.src='https://c1.popads.net/pop.js'; ps.async=true; ps.setAttribute('data-site', String(E.POPADS_SITE_ID));
    document.head.appendChild(ps);
    console.info("[ads] PopAds listo");
  }
})();
