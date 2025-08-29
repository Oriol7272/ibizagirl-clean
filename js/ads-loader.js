(function(){
  var E = window.__ENV || {};
  function add(parent, html){ var d=document.createElement('div'); d.className='ads-box'; d.innerHTML=html; parent.appendChild(d); }

  // ExoClick: usa su script de native/standard; el idzone viene de ENV
  function mountExo(where){
    if (!E.EXOCLICK_ZONE) return;
    var html = '<div data-idzone="'+E.EXOCLICK_ZONE+'" class="exoclick"></div>';
    add(where, html);
    if (!document.getElementById('exonativejs')){
      var s=document.createElement('script'); s.id='exonativejs'; s.src='https://a.exdynsrv.com/nativeads.js'; s.async=true; document.head.appendChild(s);
    }
  }
  // JuicyAds: tag estándar
  function mountJuicy(where){
    if (!E.JUICYADS_ZONE) return;
    var html = '<ins class="adsbyjuicy" data-zone="'+E.JUICYADS_ZONE+'"></ins>';
    add(where, html);
    if (!document.getElementById('jadsjs')){
      var s=document.createElement('script'); s.id='jadsjs'; s.src='https://adserver.juicyads.com/js/jads.js'; s.async=true; document.head.appendChild(s);
    }
  }
  // PopAds: popunder, sin slot visual
  if (String(E.POPADS_ENABLE||"false")==="true" && E.POPADS_SITE_ID){
    var p=document.createElement('script'); p.src='https://c1.popads.net/pop.js'; p.async=true; p.setAttribute('data-site',E.POPADS_SITE_ID); document.head.appendChild(p);
  }

  window.addEventListener('DOMContentLoaded', function(){
    var L=document.getElementById('ads-left'), R=document.getElementById('ads-right');
    if (L){ mountExo(L); mountJuicy(L); }
    if (R){ mountExo(R); mountJuicy(R); }
    console.info('[ads] sidebars montadas');
  });
})();
