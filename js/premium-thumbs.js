(async () => {
  const log = (...a)=>console.log('[premium-thumbs]', ...a);
  const env = await (await fetch('/api/env')).json();
  const BASE = env.BASE || '';
  if (!BASE) { console.warn('BASE vacío'); }

  // Carga pools globales ya existentes
  const list = (window.PREMIUM_IMAGES_PART1||[]).concat(window.PREMIUM_IMAGES_PART2||[]);
  const chosen = list.slice(0, 100);

  const grid = document.querySelector('#premium-grid');
  const frag = document.createDocumentFragment();

  chosen.forEach((name)=>{
    const url = BASE.replace(/\/$/,'') + '/uncensored/' + name + '.webp';
    const card = document.createElement('div'); card.className='card';

    const img = document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.src=url;
    const lock = document.createElement('div'); lock.className='lock'; lock.textContent='Bloqueado';
    const pp = document.createElement('div'); pp.className='pp'; pp.setAttribute('data-pp','thumb'); pp.dataset.id=name;
    const btn = document.createElement('button'); btn.className='pp-btn'; btn.innerHTML='<img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-mark-color.svg" alt=""> Comprar';
    pp.appendChild(btn);

    card.appendChild(img); card.appendChild(lock); card.appendChild(pp);
    frag.appendChild(card);
  });

  grid.innerHTML=''; grid.appendChild(frag);
  log('render:', chosen.length, 'base:', BASE);
})();
// [ibg] fix-doble-ext
(function(){
  function fixOne(urlStr){
    try{
      const u = new URL(urlStr, location.origin);
      // quita .webp.webp y .jpg.webp, .jpeg.webp, .png.webp, etc
      u.pathname = u.pathname
        .replace(/\.webp\.webp$/i, '.webp')
        .replace(/\.(jpg|jpeg|png|gif)\.webp$/i, '.$1');
      return u.toString();
    }catch(e){ return urlStr; }
  }
  function fixThumbSrcs(){
    document.querySelectorAll('.ibg-card img, img[data-ibg]').forEach(img=>{
      const fixed = fixOne(img.src || img.getAttribute('data-src') || '');
      if (fixed && fixed !== img.src) img.src = fixed;
    });
  }
  // ejecutar varias veces por si el grid se renderiza tarde
  window.addEventListener('load', fixThumbSrcs);
  document.addEventListener('DOMContentLoaded', ()=>{ setTimeout(fixThumbSrcs, 500); setTimeout(fixThumbSrcs, 2000); });
})();
