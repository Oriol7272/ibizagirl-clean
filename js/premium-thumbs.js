// js/premium-thumbs.js
;(function(){
  const base = String((window.IBG_ENV?.IBG_ASSETS_BASE_URL||'').trim()).replace(/["\s]/g,'').replace(/\/+$/,'');
  if (!base) console.warn('[thumbs] IBG_ASSETS_BASE_URL vacío');

  const root = document.getElementById('premium-root') || (()=>{
    const r = document.createElement('div');
    r.id = 'premium-root';
    document.body.appendChild(r);
    return r;
  })();

  const leftAd  = document.createElement('div');
  const rightAd = document.createElement('div');
  leftAd.id = 'ad-left'; rightAd.id = 'ad-right';
  document.body.appendChild(leftAd);
  document.body.appendChild(rightAd);

  const grid = document.createElement('div');
  grid.className = 'ibg-premium-grid';
  root.appendChild(grid);

  const overlay = document.createElement('div');
  overlay.id = 'ibg-pp-overlay';
  overlay.innerHTML = `
    <div class="ibg-pp-modal">
      <button class="close" aria-label="close">&times;</button>
      <div class="content">
        <div class="thumb-preview"></div>
        <div id="ibg-pp-buttons"></div>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e)=>{
    if (e.target.matches('#ibg-pp-overlay, .close')) overlay.classList.remove('show');
  });

  const PP_MARK = 'https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-mark-blue.svg';

  function trySources(img, stem){
    const exts = ['webp','jpg','jpeg','png'];
    let i = 0;
    function next(){
      if (i>=exts.length){ img.dataset.omitted='1'; return; }
      img.src = `${base}/uncensored/${stem}.${exts[i++]}`;
    }
    img.onerror = next; next();
  }

  function selectPremium100() {
    const u = window.UnifiedContentAPI;
    if (u && typeof u.getPremiumImages === 'function') {
      try { return u.getPremiumImages(100); } catch {}
    }
    for (const key of Object.keys(window)) {
      const v = window[key];
      if (Array.isArray(v) && v.length && typeof v[0]==='string') {
        const looksLikeName = v.every(s=>typeof s==='string' && !s.includes('/') && s.length>=6);
        if (looksLikeName && /premium|uncensored|part|data/i.test(key)) {
          return v.slice(0,100);
        }
      }
    }
    return [];
  }

  const names = selectPremium100();
  if (!names.length) { console.warn('[thumbs] sin fuentes'); return; }

  for (const stem of names) {
    const card = document.createElement('article');
    card.className = 'ibg-card';

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.className = 'blurred';
    trySources(img, stem);

    const buy = document.createElement('button');
    buy.className = 'pp-buy';
    buy.title = 'Comprar esta imagen';
    buy.innerHTML = `<img src="${PP_MARK}" alt="PayPal">`;

    buy.addEventListener('click', async ()=>{
      overlay.querySelector('.thumb-preview').innerHTML = '';
      const prev = img.cloneNode(true);
      prev.classList.remove('blurred');
      overlay.querySelector('.thumb-preview').appendChild(prev);
      overlay.classList.add('show');

      const btns = document.getElementById('ibg-pp-buttons');
      btns.innerHTML = '';
      try {
        const paypal = await window.paypalReady;
        paypal.Buttons({
          style: { layout: 'vertical', shape: 'rect' },
          createOrder: function(data, actions) {
            const amount = (window.IBG_ENV?.PAYPAL_ONESHOT_PRICE_EUR_IMAGE || '0.10');
            return actions.order.create({
              purchase_units: [{ amount: { value: String(amount) } }]
            });
          },
          onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
              overlay.classList.remove('show');
              alert('Pago completado. ¡Gracias!');
            });
          }
        }).render('#ibg-pp-buttons');
      } catch (e) {
        console.error('[paypal] error render:', e);
      }
    });

    card.appendChild(img);
    card.appendChild(buy);
    grid.appendChild(card);
  }

  console.log('[premium-thumbs] render:', names.length, 'items');
})();
