(function(){
  var E = (window.__ENV||{});
  var isProd = E.IS_PROD || (!/localhost|127\.0\.0\.1/.test(location.hostname));
  if (!isProd) { console.log('[ads] dev/off'); return; }

  // Google AdSense
  if (E.ADSENSE_ID && !document.querySelector('script[data-adsense]')) {
    var sa = document.createElement('script');
    sa.async = true; sa.crossOrigin='anonymous';
    sa.setAttribute('data-adsense','1');
    sa.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+encodeURIComponent(E.ADSENSE_ID);
    document.head.appendChild(sa);
  }
  // ExoClick
  if (E.EXO_SITE_ID && !document.querySelector('script[data-exo]')) {
    var se = document.createElement('script');
    se.async = true; se.setAttribute('data-exo','1');
    se.src = 'https://a.exdynsrv.com/ad-provider.js';
    se.onload = function(){ try{ window.adProvider && adProvider.init({siteId:E.EXO_SITE_ID}); }catch(_){} };
    document.head.appendChild(se);
  }
  // JuicyAds
  if (E.JUICY_SITE_ID && !document.querySelector('script[data-juicy]')) {
    var sj = document.createElement('script');
    sj.async = true; sj.setAttribute('data-juicy','1');
    sj.src = 'https://js.juicyads.com/jp.js';
    sj.onload = function(){ try{ window.juicyads && juicyads.init && juicyads.init({site:E.JUICY_SITE_ID}); }catch(_){} };
    document.head.appendChild(sj);
  }
  console.log('[ads] loaders attached');
})();
