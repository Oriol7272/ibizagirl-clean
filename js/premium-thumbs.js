(function(){
  const EVERY = 8;
  const LIMIT = 100;

  function ready(fn){ (document.readyState!=='loading') ? fn() : document.addEventListener('DOMContentLoaded',fn); }

  function hideLegacy(){
    const s=document.createElement('style');
    s.id='premium-hide-legacy';
    s.textContent = `
      /* oculta galerías/grids que escupen imágenes completas */
      .gallery, .full-gallery, .grid-full, .photos, .masonry, .public-grid { display:none !important; }
      /* lateral */
      #sidebar, .sidebar, .left-menu, .premium-sidebar, .menu-lateral { display:none !important; }
      /* nuestro grid */
      #premium-grid{max-width:1200px;margin:12px auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;padding:0 8px}
      #premium-grid .thumb{position:relative;background:#000;border-radius:12px;overflow:hidden}
      #premium-grid .imgwrap{position:relative}
      #premium-grid img.blur{width:100%;height:180px;object-fit:cover;filter:blur(10px) saturate(0.85);transform:scale(1.05);display:block}
      #premium-grid .overlay{position:absolute;left:0;right:0;bottom:0;padding:6px;background:linear-gradient(transparent, rgba(0,0,0,.65));display:flex;justify-content:space-between;align-items:flex-end}
      #premium-grid .price{color:#fff;font:inherit;font-size:12px;background:rgba(0,0,0,.45);padding:2px 6px;border-radius:6px}
      #premium-grid .pp{min-height:30px}
      #premium-grid .ad{grid-column:1 / -1}
      #premium-grid .ad-inner{height:90px;border:1px dashed #bbb;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:14px;color:#666;background:#fcfcfc}
    `;
    document.head.appendChild(s);
  }

  function api(){
    return window.UnifiedContentAPI || null;
  }

  function discoverArrays(){
    // heurística: arrays globales con rutas a /uncensored/ o /uncensored-videos/
    let out=[];
    for (const k in window){
      try{
        const v = window[k];
        if(Array.isArray(v) && v.length && v.slice(0,6).some(x=>typeof x==='string' && (/\/uncensored(-videos)?\//i.test(x) || /\.(jpe?g|png|webp|mp4|webm)$/i.test(x)))){
          out.push(...v);
        }
      }catch(_){}
    }
    return out;
  }

  function collectItems(){
    const A = api();
    let imgs=[], vids=[];
    try{
      if (A){
        if (typeof A.getPremiumImages==='function') imgs = A.getPremiumImages();
        else if (Array.isArray(A.premiumImages)) imgs = A.premiumImages;
        else if (typeof A.list==='function') imgs = A.list({type:'premiumImages'})||[];
        if (typeof A.getPremiumVideos==='function') vids = A.getPremiumVideos();
        else if (Array.isArray(A.premiumVideos)) vids = A.premiumVideos;
        else if (typeof A.list==='function') vids = vids.length?vids:(A.list({type:'premiumVideos'})||[]);
      }
    }catch(e){ console.warn('[thumbs] api error', e); }

    // fallback heurístico si no vino nada
    if(!imgs.length && !vids.length){
      const arr = discoverArrays();
      imgs = arr.filter(u=>/\/uncensored\/.+\.(jpe?g|png|webp)$/i.test(u)).map(u=>({__type:'image', thumb:u}));
      vids = arr.filter(u=>/\/uncensored-videos\/.+\.(mp4|webm)$/i.test(u)).map(u=>({__type:'video', thumb:u}));
    }

    // normalizar
    const norm = (x)=> (typeof x==='string') ? { thumb:x } : x;
    imgs = (imgs||[]).map(norm).map(o=>({__type:'image', ...o}));
    vids = (vids||[]).map(norm).map(o=>({__type:'video', ...o}));

    return [].concat(imgs, vids).slice(0, LIMIT);
  }

  function isVideo(it){
    const u = it.thumb || it.url || it.src || '';
    return it.__type==='video' || /\.(mp4|webm)$/i.test(u);
  }

  function ad(){
    const d=document.createElement('div');
    d.className='ad';
    d.innerHTML='<div class="ad-inner">ANUNCIO</div>';
    return d;
  }

  function tile(it, idx){
    const u = it.thumb || it.url || it.src || it.path || '#';
    const price = isVideo(it) ? 0.30 : 0.10;
    const d=document.createElement('div'); d.className='thumb';
    d.innerHTML = `
      <div class="imgwrap">
        <img src="${u}" loading="lazy" class="blur" alt="">
        <div class="overlay">
          <div class="price">${price.toFixed(2)}€</div>
          <div class="pp" id="pp-${idx}"></div>
        </div>
      </div>`;
    (function mount(){
      if(!(window.paypal_pay && window.paypal_pay.Buttons)) return setTimeout(mount,150);
      window.paypal_pay.Buttons({
        style:{ layout:'horizontal', tagline:false, height:30 },
        createOrder:(d,a)=>a.order.create({ purchase_units:[{ amount:{ currency_code:'EUR', value: price.toFixed(2) } }]}),
        onApprove:(d,a)=>a.order.capture().then(x=>console.log('[item paid]', u, x))
      }).render('#pp-'+idx);
    })();
    return d;
  }

  function render(){
    let grid=document.getElementById('premium-grid');
    if(!grid){
      grid=document.createElement('div');
      grid.id='premium-grid';
      let app=document.getElementById('premium-app');
      if(!app){ app=document.createElement('div'); app.id='premium-app'; document.body.appendChild(app); }
      app.appendChild(grid);
    }
    const items = collectItems();
    if(!items.length){ console.warn('[thumbs] sin fuentes'); return; }
    grid.innerHTML='';
    items.forEach((it,i)=>{
      if(i>0 && (i%EVERY===0)) grid.appendChild(ad());
      grid.appendChild(tile(it,i));
    });
  }

  ready(function(){ hideLegacy(); render(); });
})();
