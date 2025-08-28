;(function(){
  function waitFor(check,{tries=200,delay=50}={}){return new Promise((res,rej)=>{let n=0;(function L(){try{if(check())return res(true)}catch{};if(++n>=tries)return rej(new Error('timeout waiting deps'));setTimeout(L,delay)})()})}
  function makeURL(base,entry){let s=String(entry||'').trim();if(!s)return'';if(!s.includes('/'))s='uncensored/'+s;if(!/\.(webp|jpg|jpeg|png)$/i.test(s))s+='.webp';return base.replace(/\/+$/,'')+'/'+s.replace(/^\/+/,'')}
  async function boot(){
    await waitFor(()=>document.readyState!=='loading');
    await waitFor(()=>window.IBG_ENV&&window.IBG_ENV.IBG_ASSETS_BASE_URL);
    await waitFor(()=>Array.isArray(window.PREMIUM_IMAGES_PART1)&&Array.isArray(window.PREMIUM_IMAGES_PART2));
    const base=window.IBG_ENV.IBG_ASSETS_BASE_URL;
    const names=(window.PREMIUM_IMAGES_PART1||[]).concat(window.PREMIUM_IMAGES_PART2||[]).slice(0,100);
    if(!names.length){console.warn('[premium-thumbs] sin fuentes');return;}

    let root=document.getElementById('premium-root'); if(!root){root=document.createElement('div');root.id='premium-root';document.body.appendChild(root);}
    root.className='ibg-container';
    const layout=document.createElement('div');layout.className='ibg-layout';root.appendChild(layout);
    const left=document.createElement('aside');left.className='aside-ads';left.innerHTML='<div class="adbox">Ad</div>';layout.appendChild(left);
    const main=document.createElement('main');layout.appendChild(main);
    const right=document.createElement('aside');right.className='aside-ads';right.innerHTML='<div class="adbox">Ad</div>';layout.appendChild(right);

    const grid=document.createElement('div');grid.className='ibg-premium-grid';main.appendChild(grid);
    const PP_MARK='https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-mark-blue.svg';
    const price=String(window.IBG_ENV?.PAYPAL_ONESHOT_PRICE_EUR_IMAGE||'0.99');

    for(const raw of names){
      const url=makeURL(base,raw);
      const card=document.createElement('article');card.className='ibg-card';
      const img=document.createElement('img');img.loading='lazy';img.decoding='async';img.src=url;
      const lock=document.createElement('div');lock.className='lock';lock.innerHTML='<span>🔒</span>';
      const buy=document.createElement('button');buy.className='pp-buy';buy.title='Comprar';
      buy.innerHTML=`<img src="${PP_MARK}" alt="PayPal"><span>${price} €</span>`;
      buy.addEventListener('click',async(e)=>{
        e.preventDefault();
        try{
          const pp=await window.paypalReady;
          const wrap=document.createElement('div');wrap.className='pp-wrap';
          buy.replaceWith(wrap);
          pp.Buttons({
            style:{layout:'vertical',shape:'rect',label:'paypal',height:40},
            createOrder:(d,a)=>a.order.create({purchase_units:[{amount:{value:price}}]}),
            onApprove:(d,a)=>a.order.capture().then(()=>{img.classList.add('unlocked');lock.remove();wrap.remove();}),
            onError:(err)=>{console.error('[paypal] error',err);wrap.replaceWith(buy);}
          }).render(wrap);
        }catch(err){alert('PayPal no está listo');console.error('[paypal] no listo',err);}
      });
      card.appendChild(img);card.appendChild(lock);card.appendChild(buy);grid.appendChild(card);
    }
    console.log('[premium-thumbs] render:',names.length,'base:',base);
  }
  boot().catch(e=>console.error('[premium-thumbs] boot error',e));
})();
