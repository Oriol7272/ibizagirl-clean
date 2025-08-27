(function(){
  if(!document.body.classList.contains('premium-page')) return; // no tocar HOME
  const EVERY=8, LIMIT=100;

  // Scoped CSS
  (function(){
    const old=document.getElementById('premium-thumbs-style'); if(old) old.remove();
    const s=document.createElement('style'); s.id='premium-thumbs-style';
    s.textContent=`
      body.premium-page #premium-grid{max-width:1200px;margin:12px auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;padding:0 8px}
      body.premium-page #premium-grid .thumb{position:relative;background:#000;border-radius:12px;overflow:hidden}
      body.premium-page #premium-grid .imgwrap{position:relative}
      body.premium-page #premium-grid img.blur{width:100%;height:180px;object-fit:cover;filter:blur(10px) saturate(.85);transform:scale(1.05);display:block}
      body.premium-page #premium-grid .overlay{position:absolute;left:0;right:0;bottom:0;padding:6px;background:linear-gradient(transparent,rgba(0,0,0,.65));display:flex;justify-content:space-between;align-items:flex-end}
      body.premium-page #premium-grid .price{color:#fff;font:inherit;font-size:12px;background:rgba(0,0,0,.45);padding:2px 6px;border-radius:6px}
      body.premium-page #premium-grid .pp{min-height:30px}
      body.premium-page #premium-grid .ad{grid-column:1/-1}
      body.premium-page #premium-grid .ad-inner{height:90px;border:1px dashed #bbb;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:14px;color:#666;background:#fcfcfc}
      /* NO ocultamos nada global (para no romper HOME) */
    `;
    document.head.appendChild(s);
  })();

  function waitForContent(maxMs){
    const start=Date.now();
    return new Promise(resolve=>{
      (function poll(){
        const A=window.UnifiedContentAPI;
        let ok=false;
        try{
          const hasA=A && (
            (typeof A.getPremiumImages==='function' && (A.getPremiumImages()||[]).length) ||
            (typeof A.getPremiumVideos==='function' && (A.getPremiumVideos()||[]).length) ||
            (Array.isArray(A.premiumImages) && A.premiumImages.length) ||
            (Array.isArray(A.premiumVideos) && A.premiumVideos.length)
          );
          ok = !!hasA;
        }catch(_){}
        if(ok) return resolve(true);
        if(Date.now()-start>maxMs) return resolve(false);
        setTimeout(poll,120);
      })();
    });
  }

  function discoverArrays(){
    let out=[];
    for(const k in window){
      try{
        const v=window[k];
        if(Array.isArray(v) && v.length && v.slice(0,10).some(x=>typeof x==='string' && (/\/uncensored(-videos)?\//i.test(x) || /\.(jpe?g|png|webp|mp4|webm)$/i.test(x)))){
          out=out.concat(v);
        }
      }catch(_){}
    }
    return out;
  }

  function collectItems(){
    const A=window.UnifiedContentAPI;
    let imgs=[], vids=[];
    try{
      if(A){
        if(typeof A.getPremiumImages==='function') imgs=A.getPremiumImages()||[];
        else if(Array.isArray(A.premiumImages)) imgs=A.premiumImages;
        if(typeof A.getPremiumVideos==='function') vids=A.getPremiumVideos()||[];
        else if(Array.isArray(A.premiumVideos)) vids=A.premiumVideos;
      }
    }catch(_){}
    if(!imgs.length && !vids.length){
      const arr=discoverArrays();
      imgs=arr.filter(u=>/\/uncensored\/.+\.(jpe?g|png|webp)$/i.test(u)).map(u=>({__type:'image',thumb:u}));
      vids=arr.filter(u=>/\/uncensored-videos\/.+\.(mp4|webm)$/i.test(u)).map(u=>({__type:'video',thumb:u}));
    }
    const norm=x=>typeof x==='string'?{thumb:x}:x;
    imgs=(imgs||[]).map(norm).map(o=>({__type:'image',...o}));
    vids=(vids||[]).map(norm).map(o=>({__type:'video',...o}));
    return [].concat(imgs,vids).slice(0,LIMIT);
  }

  function isVideo(it){
    const u=it.thumb||it.url||it.src||''; return it.__type==='video'||/\.(mp4|webm)$/i.test(u);
  }

  function ad(){
    const d=document.createElement('div'); d.className='ad';
    d.innerHTML='<div class="ad-inner">ANUNCIO</div>'; return d;
  }

  function tile(it, idx){
    const u=it.thumb||it.url||it.src||it.path||'#';
    const price=isVideo(it)?0.30:0.10;
    const d=document.createElement('div'); d.className='thumb';
    d.innerHTML=`
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
        style:{layout:'horizontal',tagline:false,height:30},
        createOrder:(d,a)=>a.order.create({purchase_units:[{amount:{currency_code:'EUR',value:price.toFixed(2)}}]}),
        onApprove:(d,a)=>a.order.capture().then(x=>console.log('[item paid]', u, x))
      }).render('#pp-'+idx);
    })();
    return d;
  }

  async function boot(){
    const ok = await waitForContent(6000); // espera contenido real
    const items = collectItems();
    if(!items.length){ console.warn('[thumbs] sin fuentes'); return; }

    let grid=document.getElementById('premium-grid');
    if(!grid){ grid=document.createElement('div'); grid.id='premium-grid'; document.body.appendChild(grid); }

    grid.innerHTML='';
    items.forEach((it,i)=>{ if(i>0 && (i%EVERY===0)) grid.appendChild(ad()); grid.appendChild(tile(it,i)); });
  }

  if(document.readyState!=='loading') boot(); else document.addEventListener('DOMContentLoaded',boot);
})();
