/**
 * premium-paypal.js
 * Render centralizado de:
 *  - Suscripciones (mensual/anual) -> #btn-sub-monthly / #btn-sub-annual
 *  - Lifetime (pago único)         -> #btn-lifetime
 *  - Packs                         -> #btn-pack-10img / #btn-pack-5vid
 *  - Pago individual por thumb     -> window.renderBuyButton(selector, kind, id)
 */
(function(){
  const wait = (pred, timeout=10000) => new Promise((res, rej) => {
    const t0 = Date.now();
    (function tick(){
      if (pred()) return res();
      if (Date.now()-t0 > timeout) return rej(new Error('timeout waiting'));
      setTimeout(tick, 60);
    })();
  });

  const PAY = window.PAY || {};
  const EUR = PAY.CURRENCY || 'EUR';

  function hasEl(sel){ return document.querySelector(sel); }

  function renderSubsMonthly(){
    if (!hasEl('#btn-sub-monthly')) return;
    paypal_subs.Buttons({
      style:{shape:'pill',color:'gold',tagline:false},
      createSubscription: (_, actions) => actions.subscription.create({ plan_id: PAY.PLAN_MONTHLY }),
      onApprove: (data) => unlockAll('sub-monthly', data),
      onError:   (err) => console.error('[paypal][monthly] error:', err)
    }).render('#btn-sub-monthly');
  }

  function renderSubsAnnual(){
    if (!hasEl('#btn-sub-annual')) return;
    paypal_subs.Buttons({
      style:{shape:'pill',color:'gold',tagline:false},
      createSubscription: (_, actions) => actions.subscription.create({ plan_id: PAY.PLAN_ANNUAL }),
      onApprove: (data) => unlockAll('sub-annual', data),
      onError:   (err) => console.error('[paypal][annual] error:', err)
    }).render('#btn-sub-annual');
  }

  function renderLifetime(){
    if (!hasEl('#btn-lifetime')) return;
    const value = Number(PAY.PRICE_LIFETIME_EUR||0).toFixed(2);
    paypal_pay.Buttons({
      style:{shape:'pill',color:'gold',tagline:false},
      createOrder: (_, actions) => actions.order.create({
        intent: 'CAPTURE',
        purchase_units:[{ amount:{ value, currency_code: EUR }, description:'Lifetime' }]
      }),
      onApprove: (_, actions) => actions.order.capture()
        .then((data)=> unlockAll('lifetime', data))
        .catch((e)=> console.error('[paypal][lifetime] capture error', e)),
      onError: (err)=> console.error('[paypal][lifetime] error:', err)
    }).render('#btn-lifetime');
  }

  function renderPack10Images(){
    if (!hasEl('#btn-pack-10img')) return;
    const value = Number(PAY.PACK10_IMAGES_EUR||0.8).toFixed(2);
    paypal_pay.Buttons({
      style:{shape:'pill',color:'gold',tagline:false},
      createOrder: (_, actions) => actions.order.create({
        purchase_units:[{ amount:{ value, currency_code: EUR }, description:'Pack 10 imágenes' }]
      }),
      onApprove: (_, actions) => actions.order.capture()
        .then((data)=> creditPack('images',10,data))
        .catch((e)=> console.error('[paypal][pack10img] capture error', e)),
      onError: (err)=> console.error('[paypal][pack10img] error:', err)
    }).render('#btn-pack-10img');
  }

  function renderPack5Videos(){
    if (!hasEl('#btn-pack-5vid')) return;
    const value = Number(PAY.PACK5_VIDEOS_EUR||1.0).toFixed(2);
    paypal_pay.Buttons({
      style:{shape:'pill',color:'gold',tagline:false},
      createOrder: (_, actions) => actions.order.create({
        purchase_units:[{ amount:{ value, currency_code: EUR }, description:'Pack 5 vídeos' }]
      }),
      onApprove: (_, actions) => actions.order.capture()
        .then((data)=> creditPack('videos',5,data))
        .catch((e)=> console.error('[paypal][pack5vid] capture error', e)),
      onError: (err)=> console.error('[paypal][pack5vid] error:', err)
    }).render('#btn-pack-5vid');
  }

  // Botón por thumb (imagen/vídeo individual)
  window.renderBuyButton = (selector, kind, id) => {
    const value = Number(kind==='video' ? PAY.PRICE_VIDEO_EUR : PAY.PRICE_IMAGE_EUR).toFixed(2);
    const el = document.querySelector(selector);
    if (!el) return;
    paypal_pay.Buttons({
      style:{label:'pay',layout:'horizontal',height:32,color:'gold',shape:'pill',tagline:false},
      createOrder: (_, actions) => actions.order.create({
        purchase_units:[{ amount:{ value, currency_code: EUR }, description:`${kind}#${id}` }]
      }),
      onApprove: (_, actions) => actions.order.capture()
        .then(()=> unlockOne(id))
        .catch((e)=> console.error('[paypal][oneshot] capture error', e)),
      onError: (err)=> console.error('[paypal][oneshot] error:', err)
    }).render(el);
  };

  // Helpers mínimos (estado local fake)
  function unlockAll(reason, data){
    try { localStorage.setItem('premium_unlock', reason); } catch(_){}
    document.querySelectorAll('.thumb').forEach(t=>t.classList.add('unlocked'));
    console.log('[premium-paypal] unlockAll:', reason, data && data.subscriptionID);
  }
  function creditPack(kind, n, data){
    const key = kind==='videos' ? 'pack_videos' : 'pack_images';
    const cur = Number(localStorage.getItem(key)||0);
    localStorage.setItem(key, String(cur+n));
    console.log('[premium-paypal] creditPack:', key, '+', n, data && data.id);
  }
  function unlockOne(id){
    const t = document.querySelector(`.thumb[data-id="${CSS.escape(id)}"]`);
    if (t) t.classList.add('unlocked');
    console.log('[premium-paypal] unlockOne:', id);
  }

  // Esperar a que estén ambos namespaces (paypal_subs y paypal_pay)
  wait(()=> window.paypal_subs && window.paypal_pay)
    .then(()=>{
      console.log('[premium-paypal] SDKs listos');
      renderSubsMonthly();
      renderSubsAnnual();
      renderLifetime();
      renderPack10Images();
      renderPack5Videos();
    })
    .catch(()=> console.warn('[premium-paypal] SDKs no listos (timeout)'));
})();
