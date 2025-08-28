(() => {
  const log = (...a) => console.log('[subscription]', ...a);
  const ENV = (window.__ENV || window.ENV || {});
  const CURRENCY = 'EUR';

  // Variables tolerantes a distintos nombres
  const CLIENT_ID =
    ENV.PAYPAL_CLIENT_ID ||
    ENV.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
    ENV.PP_CLIENT_ID;

  const PLAN_MONTHLY =
    ENV.PAYPAL_PLAN_MONTHLY ||
    ENV.PAYPAL_PLAN_MONTHLY_1499 ||
    ENV.PAYPAL_PLAN_ID_MONTHLY;

  const PLAN_ANNUAL =
    ENV.PAYPAL_PLAN_ANNUAL ||
    ENV.PAYPAL_PLAN_ANNUAL_4999 ||
    ENV.PAYPAL_PLAN_ID_ANNUAL;

  const PRICE_IMAGE =
    ENV.PAYPAL_ONESHOT_PRICE_EUR_IMAGE ||
    ENV.PAYPAL_ONESHOT_IMAGE_EUR ||
    ENV.PAYPAL_ONESHOT_PRICE ||
    '0.10';

  if (!CLIENT_ID) {
    console.error('[subscription] PAYPAL_CLIENT_ID vacío');
    return;
  }

  async function loadSdkOnce() {
    if (window.paypal) return window.paypal;
    const ID = 'paypal-sdk-ibg';
    let tag = document.getElementById(ID);
    if (tag) {
      await new Promise((r) => tag.addEventListener('load', r, { once: true }));
      return window.paypal;
    }
    log('Cargando SDK…');
    const url = new URL('https://www.paypal.com/sdk/js');
    url.searchParams.set('client-id', CLIENT_ID);
    url.searchParams.set('currency', CURRENCY);
    url.searchParams.set('components', 'buttons');
    url.searchParams.set('vault', 'true'); // requerido para suscripciones

    tag = document.createElement('script');
    tag.id = ID;
    tag.src = url.toString();
    document.head.appendChild(tag);
    await new Promise((res, rej) => {
      tag.onload = () => res();
      tag.onerror = (e) => rej(e);
    });
    log('SDK suscripciones cargado');
    return window.paypal;
  }

  function ensureDiv(el) {
    // PayPal NO permite renderizar dentro de <button>
    if (el.tagName === 'BUTTON') {
      const wrap = document.createElement('div');
      wrap.className = el.className;
      // mueve dataset
      for (const k of el.getAttributeNames()) {
        if (k.startsWith('data-')) wrap.setAttribute(k, el.getAttribute(k));
      }
      el.replaceWith(wrap);
      return wrap;
    }
    return el;
  }

  async function renderButton(el, opts) {
    await loadSdkOnce();
    el = ensureDiv(el);

    return paypal
      .Buttons(
        opts.type === 'subscription'
          ? {
              style: { height: 40, label: 'subscribe', layout: 'horizontal' },
              createSubscription(_, actions) {
                return actions.subscription.create({ plan_id: opts.planId });
              },
              onApprove(data) {
                log('sub ok', data);
                try { el.classList.add('pp-ok'); } catch {}
              },
            }
          : {
              style: { height: 40, label: 'pay', layout: 'horizontal' },
              createOrder(_, actions) {
                const value = String(opts.amount ?? PRICE_IMAGE);
                return actions.order.create({
                  purchase_units: [
                    { amount: { currency_code: CURRENCY, value } },
                  ],
                });
              },
              onApprove(data, actions) {
                return actions.order.capture().then((det) => {
                  log('capture ok', det);
                  try { el.classList.add('pp-ok'); } catch {}
                });
              },
            }
      )
      .render(el);
  }

  async function boot() {
    log('ENV', ENV);
    const tasks = [];

    // Pago único para thumbs
    document.querySelectorAll('[data-pp="thumb"]').forEach((node) => {
      const price = Number(node.dataset.price || PRICE_IMAGE);
      tasks.push(() => renderButton(node, { type: 'oneshot', amount: price }));
    });

    // Suscripción mensual
    document.querySelectorAll('[data-pp="sub-monthly"]').forEach((node) => {
      const pid = node.dataset.plan || PLAN_MONTHLY;
      if (pid) tasks.push(() => renderButton(node, { type: 'subscription', planId: pid }));
    });

    // Suscripción anual
    document.querySelectorAll('[data-pp="sub-annual"]').forEach((node) => {
      const pid = node.dataset.plan || PLAN_ANNUAL;
      if (pid) tasks.push(() => renderButton(node, { type: 'subscription', planId: pid }));
    });

    // Render SECUENCIAL para evitar "zoid destroyed..." y "global_session_not_found"
    for (const run of tasks) {
      try { await run(); } catch (e) { console.error('render error', e); }
    }
  }

  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
