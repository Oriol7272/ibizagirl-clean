;(function(){
  function waitFor(check, {tries=120, delay=80}={}) {
    return new Promise((resolve, reject)=>{
      let n=0;(function loop(){try{if(check())return resolve(true);}catch{};if(++n>=tries)return reject(new Error('timeout waiting deps'));setTimeout(loop,delay);})();
    });
  }
  // prueba varias carpetas en origen: /uncensored -> /uncensored-images -> /premium
  const DIRS = ['/uncensored','/uncensored-images','/premium'];

  function tryLoad(img, base, stem){
    let i=0;
    function next(){
      if(i>=DIRS.length){ img.dataset.omitted='1'; return; }
      img.src = `${base}${DIRS[i++]}/${stem}.webp`;
    }
    img.onerror = next;
    img.onload = ()=> img.classList.add('loaded');
    next();
  }

  async function boot(){
    await waitFor(()=> document.readyState !== 'loading');
    await waitFor(()=> window.IBG_ENV && window.IBG_ENV.IBG_ASSETS_BASE_URL);
    await waitFor(()=> Array.isArray(window.PREMIUM_IMAGES_PART1) && Array.isArray(window.PREMIUM_IMAGES_PART2));

    const base = String(window.IBG_ENV.IBG_ASSETS_BASE_URL||'').replace(/["\s]/g,'').replace(/\/+$/,'');
    const names = (window.PREMIUM_IMAGES_PART1||[]).concat(window.PREMIUM_IMAGES_PART2||[]).slice(0,100);
    if (!names.length) { console.warn('[premium-thumbs] sin fuentes'); return; }

    // contenedor central (con laterales para anuncios como en home)
    let root = document.getElementById('premium-root');
    if (!root) { root = document.createElement('div'); root.id='premium-root'; document.body.appendChild(root); }
    root.className='ibg-container';
    const layout = document.createElement('div'); layout.className='ibg-layout'; root.appendChild(layout);
    const left = document.createElement('aside'); left.className='aside-ads'; left.innerHTML='<div id="ad-left"></div>'; layout.appendChild(left);
    const main = document.createElement('main'); layout.appendChild(main);
    const right = document.createElement('aside'); right.className='aside-ads'; right.innerHTML='<div id="ad-right"></div>'; layout.appendChild(right);

    const grid = document.createElement('div'); grid.className='ibg-premium-grid'; main.appendChild(grid);

    const PP_MARK='https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-mark-blue.svg';
    for (const raw of names) {
      const stem = String(raw).replace(/\.(webp|jpg|jpeg|png)$/i,''); // todos vienen con extensión: nos quedamos con el stem
      const card=document.createElement('article'); card.className='ibg-card';
      const img=document.createElement('img'); img.loading='lazy'; img.decoding='async';
      tryLoad(img, base, stem);

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
    console.log('[premium-thumbs] render:', names.length, 'base:', base);
  }
  boot().catch(e=>console.error('[premium-thumbs] boot error', e));
})();
