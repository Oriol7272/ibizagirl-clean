(() => {
  const log = (...a)=>console.log('[subscription]', ...a);
  let cfg = null;

  async function getEnv(){
    if (cfg) return cfg;
    const r = await fetch('/api/env'); cfg = await r.json(); return cfg;
  }

  // Carga ÚNICA del SDK (una sola etiqueta <script>)
  async function loadSDK() {
    const { PAYPAL_CLIENT_ID } = await getEnv();
    if (!PAYPAL_CLIENT_ID) { console.error('[paypal] CLIENT_ID vacío'); return null; }
    if (window.paypal) return window.paypal;
    const url = new URL('https://www.paypal.com/sdk/js');
    url.searchParams.set('client-id', PAYPAL_CLIENT_ID);
    url.searchParams.set('currency', 'EUR');
    url.searchParams.set('components', 'buttons');  // un solo componente
    url.searchParams.set('vault', 'true');          // permite suscripciones
    // NOTA: NO fijamos intent aquí; se define en createOrder / createSubscription
    await new Promise((res, rej)=>{
      const s=document.createElement('script');
      s.src=url.toString(); s.onload=res; s.onerror=rej; document.head.appendChild(s);
    });
    return window.paypal;
  }

  // Renderiza botón en un contenedor
  async function renderButton(el, opts){
    const paypal = await loadSDK(); if(!paypal) return;
    const { type, planId, amount, ref } = opts;

    paypal.Buttons({
      style: { shape:'pill', label:'paypal', layout:'horizontal', tagline:false, height:35 },
      createSubscription: type==='subscription'
        ? function(data, actions){ return actions.subscription.create({ plan_id: planId }); }
        : undefined,
      createOrder: type==='oneshot'
        ? function(data, actions){
            return actions.order.create({ intent:'CAPTURE',
              purchase_units:[{ reference_id: ref || 'thumb', amount:{ currency_code:'EUR', value: amount } }]
            });
          }
        : undefined,
      onApprove: function(data, actions){
        // Aquí desbloqueas la imagen o das acceso
        const card = el.closest('.card');
        card?.querySelector('img')?.classList.add('unlocked');
        card?.querySelector('.lock')?.remove();
        el.innerHTML = '<span class="pill">Comprado ✓</span>';
      }
    }).render(el);
  }

  // Inicializa todos los botones de la página
  async function boot(){
    const env = await getEnv(); log('ENV', env);
    document.querySelectorAll('[data-pp=thumb]').forEach((node)=>{
      renderButton(node, { type:'oneshot', amount: env.PAYPAL_ONESHOT_PRICE_EUR_IMAGE, ref: node.dataset.id });
    });
    document.querySelectorAll('[data-pp=sub-monthly]').forEach((node)=>{
      renderButton(node, { type:'subscription', planId: env.PAYPAL_PLAN_MONTHLY });
    });
    document.querySelectorAll('[data-pp=sub-annual]').forEach((node)=>{
      renderButton(node, { type:'subscription', planId: env.PAYPAL_PLAN_ANNUAL });
    });
  }

  window.addEventListener('DOMContentLoaded', boot);
})();
