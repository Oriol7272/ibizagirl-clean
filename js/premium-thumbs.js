;(function(){
  function waitFor(check, {tries=120, delay=80}={}) {
    return new Promise((resolve, reject)=>{
      let n=0;
      (function loop(){
        try { if (check()) return resolve(true); } catch{}
        if (++n>=tries) return reject(new Error('timeout waiting deps'));
        setTimeout(loop, delay);
      })();
    });
  }

  function trySources(img, base, stem){
    const exts=['webp','jpg','jpeg','png']; let i=0;
    function next(){ if (i>=exts.length){ img.dataset.omitted='1'; return; } img.src = `${base}/uncensored/${stem}.${exts[i++]}`; }
    img.onerror=next; next();
  }

  async function boot(){
    await waitFor(()=> document.readyState === 'complete' || document.readyState === 'interactive');
    await waitFor(()=> window.IBG_ENV && window.IBG_ENV.IBG_ASSETS_BASE_URL);
    await waitFor(()=> Array.isArray(window.PREMIUM_IMAGES_PART1) && Array.isArray(window.PREMIUM_IMAGES_PART2));

    const base = String(window.IBG_ENV.IBG_ASSETS_BASE_URL||'').replace(/["\s]/g,'').replace(/\/+$/,'');
    if (!base) { console.warn('[thumbs] base vacío'); return; }

    // ads laterales
    for (const id of ['ad-left','ad-right']) if (!document.getElementById(id)) {
      const d=document.createElement('div'); d.id=id; document.body.appendChild(d);
    }

    let root = document.getElementById('premium-root');
    if (!root) { root = document.createElement('div'); root.id='premium-root'; document.body.appendChild(root); }

    const grid = document.querySelector('.ibg-premium-grid') || (()=>{ const g=document.createElement('div'); g.className='ibg-premium-grid'; root.appendChild(g); return g; })();

    // 100 primeras de PART1+PART2
    const names = (window.PREMIUM_IMAGES_PART1||[]).concat(window.PREMIUM_IMAGES_PART2||[]).slice(0,100);
    if (!names.length) { console.warn('[thumbs] sin fuentes'); return; }

    const PP_MARK='https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-mark-blue.svg';
    for (const stem of names) {
      const card=document.createElement('article'); card.className='ibg-card';
      const img=document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.className='blurred';
      trySources(img, base, stem);
      const buy=document.createElement('button'); buy.className='pp-buy'; buy.title='Comprar';
      buy.innerHTML = `<img src="${PP_MARK}" alt="PayPal">`;

      buy.addEventListener('click', async ()=>{
        try{
          const paypal=await window.paypalReady;
          const amount=(window.IBG_ENV?.PAYPAL_ONESHOT_PRICE_EUR_IMAGE||'0.10');
          paypal.Buttons({
            style:{layout:'vertical',shape:'rect'},
            createOrder:(data,actions)=> actions.order.create({ purchase_units:[{ amount:{ value:String(amount) } }] }),
            onApprove:(data,actions)=> actions.order.capture().then(()=> alert('Pago completado. Gracias!'))
          }).render(buy);
        }catch(e){ console.error('[paypal] error', e); }
      });

      card.appendChild(img); card.appendChild(buy); grid.appendChild(card);
    }
    console.log('[premium-thumbs] render:', names.length);
  }
  boot().catch(e=>console.error('[thumbs] boot error', e));
})();
