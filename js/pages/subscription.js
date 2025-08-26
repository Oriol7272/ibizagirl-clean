import { pay, subscribe } from '../paypal.js';

function ensureCss(){
  if(!document.getElementById('css-ibg-sub')){
    const l=document.createElement('link'); l.id='css-ibg-sub'; l.rel='stylesheet'; l.href='/css/ibg-subscription.css';
    document.head.appendChild(l);
  }
}
export async function initSubscription(){
  ensureCss();

  // anuncios laterales (subs mantienen anuncios)
  function ensure(id,cls,host){ let el=document.getElementById(id); if(!el){el=document.createElement('div'); el.id=id; el.className=cls; (host||document.body).appendChild(el);} return el; }
  ensure('ad-left','side-ad left',document.body).innerHTML='<div class="ad-box" id="ad-left-box"></div>';
  ensure('ad-right','side-ad right',document.body).innerHTML='<div class="ad-box" id="ad-right-box"></div>';

  const app=document.getElementById('app');
  app.innerHTML = `
    <div class="sub-hero">
      <h1>Suscripciones</h1>
      <p class="note">Mensual y Anual <b>con anuncios</b>. La opción <b>Lifetime</b> desbloquea todo y <b>elimina anuncios</b>.</p>
    </div>
    <section class="plans">
      <div class="plan" id="plan-month">
        <h3>Mensual</h3>
        <div class="price">14,99 € / mes</div>
        <div class="desc">Acceso a TODO el contenido mientras esté activa (con anuncios).</div>
        <button id="btn-month"><span class="pp"></span><span>Suscribirme</span></button>
      </div>
      <div class="plan" id="plan-year">
        <h3>Anual</h3>
        <div class="price">49,99 € / año</div>
        <div class="desc">Acceso a TODO el contenido durante un año (con anuncios).</div>
        <button id="btn-year"><span class="pp"></span><span>Suscribirme</span></button>
      </div>
      <div class="plan" id="plan-life">
        <h3>Lifetime</h3>
        <div class="price">100 € único</div>
        <div class="desc">Acceso a TODO para siempre y <b>sin anuncios</b>.</div>
        <button id="btn-life"><span class="pp"></span><span>Comprar Lifetime</span></button>
      </div>
    </section>
  `;

  const IBG = window.IBG || {};

  // Mensual
  document.getElementById('btn-month').addEventListener('click', ()=>{
    const plan = IBG.PAYPAL_PLAN_MONTHLY_1499;
    if(!plan){ console.warn('PAYPAL_PLAN_MONTHLY_1499 ausente'); return; }
    subscribe(plan, ()=>{
      localStorage.setItem('ibg_subscribed','1');
      alert('¡Suscripción mensual activa!');
    });
  });

  // Anual
  document.getElementById('btn-year').addEventListener('click', ()=>{
    const plan = IBG.PAYPAL_PLAN_ANNUAL_4999;
    if(!plan){ console.warn('PAYPAL_PLAN_ANNUAL_4999 ausente'); return; }
    subscribe(plan, ()=>{
      localStorage.setItem('ibg_subscribed','1');
      alert('¡Suscripción anual activa!');
    });
  });

  // Lifetime (100 €) — quita anuncios
  document.getElementById('btn-life').addEventListener('click', ()=>{
    pay(100.00, ()=>{
      localStorage.setItem('ibg_lifetime','1');
      localStorage.setItem('ibg_no_ads','1');
      alert('¡Lifetime activado! Anuncios deshabilitados.');
      location.reload();
    });
  });
}
