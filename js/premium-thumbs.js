;(function(){
  function waitFor(check, {tries=200, delay=50}={}) {
    return new Promise((resolve, reject)=>{
      let n=0;(function loop(){try{if(check())return resolve(true);}catch{};if(++n>=tries)return reject(new Error('timeout waiting deps'));setTimeout(loop,delay);})();
    });
  }
  function makeURL(base, entry){
    let s = String(entry || '').trim();
    if (!s) return '';
    const hasSlash = s.includes('/');
    const hasExt = /\.(webp|jpg|jpeg|png)$/i.test(s);
    if (!hasSlash) s = 'uncensored/' + s;
    if (!hasExt) s = s + '.webp';
    return (base.replace(/\/+$/,'') + '/' + s.replace(/^\/+/, ''));
  }
  async function boot(){
    await waitFor(()=> document.readyState !== 'loading');
    await waitFor(()=> window.IBG_ENV && window.IBG_ENV.IBG_ASSETS_BASE_URL);
    await waitFor(()=> Array.isArray(window.PREMIUM_IMAGES_PART1) && Array.isArray(window.PREMIUM_IMAGES_PART2));
    const base = window.IBG_ENV.IBG_ASSETS_BASE_URL;
    const names = (window.PREMIUM_IMAGES_PART1||[]).concat(window.PREMIUM_IMAGES_PART2||[]).slice(0,100);
    if (!names.length) { console.warn('[premium-thumbs] sin fuentes'); return; }

    // Layout + anuncios laterales
    let root=document.getElementById('premium-root'); if(!root){root=document.createElement('div');root.id='premium-root';document.body.appendChild(root);}
    root.className='ibg-container';
    const layout=document.createElement('div');layout.className='ibg-layout';root.appendChild(layout);
    const left=document.createElement('aside');left.className='aside-ads';left.innerHTML='<div class="adbox">Ad</div>';layout.appendChild(left);
    const main=document.createElement('main');layout.appendChild(main);
    const right=document.createElement('aside');right.className='aside-ads';right.innerHTML='<div class="adbox">Ad</div>';layout.appendChild(right);

    const grid=document.createElement('div');grid.className='ibg-premium-grid';main.appendChild(grid);

    const PP_MARK='https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-mark-blue.svg';
    const price = String(window.IBG_ENV?.PAYPAL_ONESHOT_PRICE_EUR_IMAGE || '0.99');

    for (const raw of names) {
      const url = makeURL(base, raw);
      const card=document.createElement('article'); card.className='ibg-card';
      const img=document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.src=url;
      // BLUR SIEMPRE (se quita sólo tras pago real, futura integración de gating)
      // Añadimos overlay lock
      const lock=document.createElement('div'); lock.className='lock';
      lock.innerHTML='<span>🔒</span>';

      const buy=document.createElement('button'); buy.className='pp-buy'; buy.title='Comprar';
      buy.innerHTML = `<img src="${PP_MARK}" alt="PayPal"><span>${price} €</span>`;
      buy.addEventListener('click', async (ev)=>{
        ev.preventDefault();
        try{
          const pp=await window.paypalReady;
          const btnWrap=document.createElement('div'); btnWrap.className='pp-wrap';
          buy.replaceWith(btnWrap);
          pp.Buttons({
            style:{layout:'vertical',shape:'rect',label:'paypal',height:40},
            createOrder:(data,actions)=> actions.order.create({ purchase_units:[{ amount:{ value: price } }] }),
            onApprove:(data,actions)=> actions.order.capture().then(()=>{
              // desbloqueo visual
              img.classList.add('unlocked');
              lock.remove();
              btnWrap.remove();
            }),
            onError:(err)=>{ console.error('[paypal] error', err); btnWrap.replaceWith(buy); }
          }).render(btnWrap);
        }catch(e){
          alert('No se pudo cargar PayPal. Vuelve a intentarlo.');
          console.error('[paypal] no listo', e);
        }
      });

      card.appendChild(img);
      card.appendChild(lock);
      card.appendChild(buy);
      grid.appendChild(card);
    }
    console.log('[premium-thumbs] render:', names.length, 'base:', base);
  }
  boot().catch(e=>console.error('[premium-thumbs] boot error', e));
})();
