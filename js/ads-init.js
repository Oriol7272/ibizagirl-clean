/* global eaCtrl */
const log = (...a)=>console.log('[ADS]', ...a);

function ensureEl(sel, html, parent=document.body){
  let el = document.querySelector(sel);
  if(!el){
    const tmp = document.createElement('div');
    tmp.innerHTML = html.trim();
    el = tmp.firstElementChild;
    parent.appendChild(el);
  }
  return el;
}

function ensureScript(src, attrs={}){
  return new Promise(res=>{
    if ([...document.scripts].some(s=>s.src===src)) return res(true);
    const s=document.createElement('script');
    s.src=src; s.async=true;
    Object.entries(attrs).forEach(([k,v])=>s.setAttribute(k,v));
    s.onload=()=>res(true); s.onerror=()=>res(false);
    document.head.appendChild(s);
  });
}

async function loadVendors(){
  const r = {};
  r.juicy = await ensureScript('https://poweredby.jads.co/js/jads.js');
  r.exo   = await ensureScript('https://a.magsrv.com/ad-provider.js');
  if(!window.eaCtrl){
    var eaCtrlRecs=[]; window.eaCtrl = { add:ag=>eaCtrlRecs.push(ag) };
    r.ero = await new Promise(ok=>{
      const s=document.createElement('script');
      s.src='https://go.easrv.cl/loadeactrl.go?pid=152716&spaceid=8177575&ctrlid=798544';
      s.onload=()=>ok(true); s.onerror=()=>ok(false);
      document.head.appendChild(s);
    });
  } else r.ero = true;
  log('vendors', r);
  return r;
}

function slotJuicy(container){
  const ins=document.createElement('ins');
  ins.id='1100308';
  ins.setAttribute('data-width','300');
  ins.setAttribute('data-height','250');
  container.appendChild(ins);
  (window.adsbyjuicy=window.adsbyjuicy||[]).push({adzone:1100308});
}

function slotExo(container, zoneId){
  const ins=document.createElement('ins');
  ins.className='eas6a97888e2';
  ins.setAttribute('data-zoneid', String(zoneId));
  container.appendChild(ins);
  (window.AdProvider=window.AdProvider||[]).push({serve:{}});
}

function slotEro(container, displayId){
  const d=document.createElement('div');
  d.id = displayId;
  d.innerHTML='&nbsp;';
  container.appendChild(d);
  window.eaCtrl && eaCtrl.add({display:displayId, sid:8177575, plugin:'banner'});
}

function fallback(container){
  container.innerHTML='';
  const a=document.createElement('a');
  a.href='/premium.html'; a.target='_self';
  const img=new Image();
  img.src='/decorative-images/paradise-beach.png';
  img.alt='Premium'; img.style.width='300px'; img.style.height='250px'; img.style.objectFit='cover';
  a.appendChild(img); container.appendChild(a);
}

function waitPaint(container, ms=6000){
  return new Promise(resolve=>{
    const t0=Date.now();
    const iv=setInterval(()=>{
      const ifr=container.querySelector('iframe');
      if(ifr && ifr.getBoundingClientRect().width>0){ clearInterval(iv); resolve(true); }
      else if(Date.now()-t0>ms){ clearInterval(iv); resolve(false); }
    }, 250);
  });
}

export async function initAds(){
  const main = document.querySelector('main') || document.body;
  // columnas laterales (si no existen, las creamos)
  const left = ensureEl('#ads-left',
    '<aside id="ads-left" class="ads-column"></aside>', main);
  const right = ensureEl('#ads-right',
    '<aside id="ads-right" class="ads-column"></aside>', main);

  // contenedores 4x por lado
  const mkCol = (side)=> {
    side.innerHTML='';
    const wrap=document.createElement('div'); wrap.className='ads-stack';
    for(let i=0;i<4;i++){
      const box=document.createElement('div'); box.className='ad-box'; wrap.appendChild(box);
    }
    side.appendChild(wrap);
    return [...wrap.querySelectorAll('.ad-box')];
  };
  const L = mkCol(left);
  const R = mkCol(right);

  await loadVendors();

  // Izquierda: J, Exo(5696328), Ero(left), J
  slotJuicy(L[0]);
  slotExo(L[1], 5696328);
  slotEro(L[2], 'sp_8177575_node_left');
  slotJuicy(L[3]);

  // Derecha: J, Exo(5705186), Ero(right), J
  slotJuicy(R[0]);
  slotExo(R[1], 5705186);
  slotEro(R[2], 'sp_8177575_node_right');
  slotJuicy(R[3]);

  // Espera y fallback si no pintan
  const results = await Promise.all(
    [...L, ...R].map(b => waitPaint(b, 6000).then(ok => ({box:b, ok})))
  );
  results.forEach(({box, ok})=>{ if(!ok) fallback(box); });

  log('ready. CMP?', !!window.__tcfapi ? 'present' : 'missing');
  if(!window.__tcfapi){
    console.warn('[ADS][GDPR] No hay CMP (IAB TCF). Es habitual que Juicy/Exo/Ero sirvan poco o nada en la UE sin consentimiento.');
  }
}
