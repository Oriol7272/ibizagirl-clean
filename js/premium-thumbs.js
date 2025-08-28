(function(){
  const BASE = (window.__ENV && window.__ENV.BASE) || 'https://ibizagirl.pics';

  function pickFirst100(){
    const a = (window.PREMIUM_IMAGES_PART1 || []);
    const b = (window.PREMIUM_IMAGES_PART2 || []);
    const merged = a.concat(b);
    const clean = merged.filter(x => typeof x === 'string' && (x.endsWith('.webp') || x.endsWith('.jpg') || x.endsWith('.jpeg')));
    return clean.slice(0, 100);
  }

  function paypalBadge(){
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.5 21h-2l2-12h2l-2 12Zm10.75-12.5c-.46 0-.92.05-1.36.16l.06-.36c.21-1.27-.78-2.3-2.07-2.3H9.1a1 1 0 0 0-.98.82L6.5 18.99H10l.34-2.04h2.02c2.77 0 4.96-2 5.38-4.62.39-2.3-1.42-3.83-3.49-3.83Z"/></svg>';
  }

  function render(){
    const grid = document.getElementById('premium-grid');
    if(!grid){ console.error("premium-grid no encontrado"); return; }
    const items = pickFirst100();
    console.log("[premium-thumbs] render:", items.length, "base:", BASE);

    const frag = document.createDocumentFragment();
    items.forEach((path, idx) => {
      const src = path.startsWith('http') ? path : `${BASE}/${path}`;
      const card = document.createElement('div'); card.className='card';
      const img = document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.alt=`Premium ${idx+1}`; img.src=src;
      const btn = document.createElement('button'); btn.className='buy'; btn.type='button'; btn.innerHTML=paypalBadge()+' €0.10';
      btn.addEventListener('click', () => { if(window.IBG && typeof window.IBG.payImage==='function'){ window.IBG.payImage({ src, priceEUR:0.10 }); } else { alert('Pago individual no disponible ahora mismo.'); }});
      card.appendChild(img); card.appendChild(btn); frag.appendChild(card);
    });
    grid.innerHTML=''; grid.appendChild(frag);
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', render); } else { render(); }
})();
