(function(){
  var ENV = (window.__ENV || {});

  function createLayout(){
    var grid = document.getElementById('premium-grid');
    if (!grid) return;

    // Si ya tenemos layout, no repetir
    var already = grid.closest('.ibg-layout');
    if (already) return;

    // Crear layout con sidebars
    var wrap = document.createElement('div');
    wrap.className = 'ibg-layout';

    var left = document.createElement('aside');
    left.className = 'ibg-sidebar left';
    left.innerHTML = '<div class="ad-slot" id="ad-left"></div>';

    var main = document.createElement('main');
    main.className = 'ibg-content';

    var right = document.createElement('aside');
    right.className = 'ibg-sidebar right';
    right.innerHTML = '<div class="ad-slot" id="ad-right"></div>';

    // Insertar en DOM
    grid.parentNode.insertBefore(wrap, grid);
    wrap.appendChild(left);
    wrap.appendChild(main);
    wrap.appendChild(right);
    main.appendChild(grid);
  }

  function mountAds(){
    var L = document.getElementById('ad-left');
    var R = document.getElementById('ad-right');

    // JUICYADS (LEFT) – usar URL ABSOLUTA, no relativa (evita 404)
    if (ENV.JUICYADS_ZONE && L){
      var jf = document.createElement('iframe');
      jf.loading        = 'lazy';
      jf.referrerPolicy = 'no-referrer';
      jf.src            = 'https://juicyads.com/adshow.php?adzone=' + encodeURIComponent(ENV.JUICYADS_ZONE);
      jf.width = '300'; jf.height = '600'; jf.frameBorder = '0'; jf.scrolling = 'no';
      L.appendChild(jf);
    }

    // EXOCLICK (RIGHT) – iframe directo para evitar CORS/XHR
    if (ENV.EXOCLICK_ZONE && R){
      var ef = document.createElement('iframe');
      ef.loading        = 'lazy';
      ef.referrerPolicy = 'no-referrer';
      ef.src            = 'https://syndication.exdynsrv.com/ads-iframe-display.php?idzone=' + encodeURIComponent(ENV.EXOCLICK_ZONE);
      ef.width = '300'; ef.height = '600'; ef.frameBorder = '0'; ef.scrolling = 'no';
      R.appendChild(ef);
    }

    // POPADS – solo si enable=true y hay site_id
    var popEnabled = String(ENV.POPADS_ENABLE || '').toLowerCase() === 'true';
    if (popEnabled && ENV.POPADS_SITE_ID){
      var s = document.createElement('script');
      s.src = 'https://c1.popads.net/pop.js';
      s.async = true;
      s.setAttribute('data-site', ENV.POPADS_SITE_ID);
      (document.head || document.body).appendChild(s);
    }

    console.info('[ads] sidebars montadas');
  }

  function start(){
    try { createLayout(); mountAds(); }
    catch(e){ console.error('[ads-loader] error', e); }
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
