(function(){
  const L = (..args)=>console.log('[ADS][loader]', ...args);

  function injectJuicy(slot) {
    try {
      const ins = document.createElement('ins');
      ins.id = '1100308';
      ins.setAttribute('data-width','300');
      ins.setAttribute('data-height','250');
      slot.appendChild(ins);

      (window.adsbyjuicy = window.adsbyjuicy || []).push({ adzone: 1100308 });
      L('juicy push -> 1100308');
      return true;
    } catch(e){ L('juicy error', e); return false; }
  }

  function injectExo(slot, zoneId) {
    try {
      const ins = document.createElement('ins');
      ins.className = 'eas6a97888e2';
      ins.setAttribute('data-zoneid', String(zoneId));
      slot.appendChild(ins);
      (window.AdProvider = window.AdProvider || []).push({ serve: {} });
      L('exo push ->', zoneId);
      return true;
    } catch(e){ L('exo error', e); return false; }
  }

  function ensureScript(src, attr={}) {
    return new Promise((resolve) => {
      // si ya existe
      const exists = [...document.scripts].some(s => s.src === src);
      if (exists) return resolve(true);

      const s = document.createElement('script');
      s.async = true;
      s.src = src;
      Object.entries(attr).forEach(([k,v])=>s.setAttribute(k,v));
      s.onload = ()=> resolve(true);
      s.onerror = ()=> resolve(false);
      document.head.appendChild(s);
    });
  }

  async function loadVendors() {
    const r = {};
    r.juicy = await ensureScript('https://poweredby.jads.co/js/jads.js');
    r.exo   = await ensureScript('https://a.magsrv.com/ad-provider.js');
    // Ero: loader maestro + dos displays
    r.ero   = await new Promise((ok)=>{
      if (window.eaCtrl) return ok(true);
      var eaCtrlRecs=[]; window.eaCtrl={add:function(ag){eaCtrlRecs.push(ag)}};
      const s=document.createElement('script');
      s.src='https://go.easrv.cl/loadeactrl.go?pid=152716&spaceid=8177575&ctrlid=798544';
      s.onload=()=>ok(true);
      s.onerror=()=>ok(false);
      document.head.appendChild(s);
    });
    L('vendors loaded', r);
    return r;
  }

  function size(el){
    const r = el.getBoundingClientRect();
    return Math.round(r.width)+'x'+Math.round(r.height);
  }

  function fallback(slot) {
    // house ad simple (imagen -> premium)
    const a = document.createElement('a');
    a.href = '/premium.html';
    a.target = '_self';
    const img = document.createElement('img');
    img.alt = 'Join Premium';
    img.style.width='300px';
    img.style.height='250px';
    img.style.objectFit='cover';
    img.src = '/decorative-images/paradise-beach.png';
    a.appendChild(img);
    slot.innerHTML='';
    slot.appendChild(a);
    L('fallback shown in', slot.id);
  }

  function waitPaint(el, ms=5000) {
    return new Promise(res=>{
      const t0 = Date.now();
      const iv = setInterval(()=>{
        const r = el.querySelector('iframe');
        if (r && r.getBoundingClientRect().width>0) {
          clearInterval(iv); res(true);
        } else if (Date.now()-t0>ms) {
          clearInterval(iv); res(false);
        }
      }, 300);
    });
  }

  async function run() {
    const left  = document.getElementById('ads-left');
    const right = document.getElementById('ads-right');
    if (!left || !right) { L('no sidebars detected'); return; }

    const v = await loadVendors();

    // Juicy + Exo + Ero (left)
    left.innerHTML = '';
    injectJuicy(left);
    injectExo(left, 5696328);
    window.eaCtrl && eaCtrl.add({display:'sp_8177575_node_left', sid:8177575, plugin:'banner'});

    // Juicy + Exo + Ero (right)
    right.innerHTML = '';
    injectJuicy(right);
    injectExo(right, 5705186);
    window.eaCtrl && eaCtrl.add({display:'sp_8177575_node_right', sid:8177575, plugin:'banner'});

    // Espera a que pinten, si no -> fallback
    const okLeft  = await waitPaint(left, 6000);
    const okRight = await waitPaint(right, 6000);
    if (!okLeft)  fallback(left);
    if (!okRight) fallback(right);

    // Logs
    L('done. sizes -> L:', size(left), 'R:', size(right));
    if (!window.__tcfapi) console.warn('[ADS][gdpr] No hay CMP (__tcfapi). En UE algunas redes no sirven sin consentimiento.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
