;(function(){
  const base = String((window.IBG_ENV?.IBG_ASSETS_BASE_URL||'').trim()).replace(/["\s]/g,'').replace(/\/+$/,'');
  if (!base) console.warn('[thumbs] IBG_ASSETS_BASE_URL vacío');

  let root = document.getElementById('premium-root');
  if (!root) { root = document.createElement('div'); root.id = 'premium-root'; document.body.appendChild(root); }

  // Ads laterales
  for (const id of ['ad-left','ad-right']) {
    if (!document.getElementById(id)) {
      const d = document.createElement('div'); d.id = id; document.body.appendChild(d);
    }
  }

  // Grid
  const grid = document.querySelector('.ibg-premium-grid') || (()=>{
    const g = document.createElement('div'); g.className = 'ibg-premium-grid'; root.appendChild(g); return g;
  })();

  // Modal PayPal básico
  if (!document.getElementById('ibg-pp-overlay')) {
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
    overlay.addEventListener('click', (e)=>{ if (e.target.matches('#ibg-pp-overlay, .close')) overlay.classList.remove('show'); });
  }

  const PP_MARK = 'https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-mark-blue.svg';
  function trySources(img, stem){
    const exts = ['webp','jpg','jpeg','png']; let i=0;
    function next(){ if (i>=exts.length){ img.dataset.omitted='1'; return; } img.src = `${base}/uncensored/${stem}.${exts[i++]}`; }
    img.onerror = next; next();
  }

  function pick100() {
    const u = window.UnifiedContentAPI;
    if (u && typeof u.getPremiumImages === 'function') {
      try { return u.getPremiumImages(100); } catch {}
    }
    for (const k of Object.keys(window)) {
      const v = window[k];
      if (Array.isArray(v) && v.length && typeof v[0]==='string') {
        const looks = v.every(s=>typeof s==='string' && !s.includes('/') && s.length>=6);
        if (looks && /premium|uncensored|part|data/i.test(k)) return v.slice(0,100);
      }
    }
    return [];
  }

  const names = pick100();
  if (!names.length) { console.warn('[thumbs] sin fuentes'); return; }

  // Render
  for (const stem of names) {
    const card = document.createElement('article'); card.className='ibg-card';
    const img = document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.className='blurred'; trySources(img, stem);
    const buy = document.createElement('button'); buy.className='pp-buy'; buy.title='Comprar esta imagen';
    buy.innerHTML = `<img src="${PP_MARK}" alt="PayPal">`;
    buy.addEventListener('click', async ()=>{
      const o = document.getElementById('ibg-pp-overlay'); o.classList.add('show');
      const prevBox = o.querySelector('.thumb-preview'); prevBox.innerHTML=''; const prev = img.cloneNode(true); prev.classList.remove('blurred'); prevBox.appendChild(prev);
      try {
        const paypal = await window.paypalReady;
        const mount = o.querySelector('#ibg-pp-buttons'); mount.innerHTML='';
        paypal.Buttons({
          style: { layout: 'vertical', shape: 'rect' },
          createOrder: (data, actions)=>{
            const amount = (window.IBG_ENV?.PAYPAL_ONESHOT_PRICE_EUR_IMAGE || '0.10');
            return actions.order.create({ purchase_units: [{ amount: { value: String(amount) } }] });
          },
          onApprove: (data, actions)=> actions.order.capture().then(()=>{ o.classList.remove('show'); alert('Pago completado. Gracias!'); })
        }).render(mount);
      } catch (e) { console.error('[paypal] render error:', e); }
    });
    card.appendChild(img); card.appendChild(buy); grid.appendChild(card);
  }
  console.log('[premium-thumbs] render:', names.length);
})();
