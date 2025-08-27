(function(){
  const ADS_EVERY = Number((window.IBG_ENV||{}).ADS_EVERY || 8);
  const GRID_LIMIT = 100;

  function ready(fn){ (document.readyState!=='loading') ? fn() : document.addEventListener('DOMContentLoaded',fn); }
  function getAPI(){ return window.UnifiedContentAPI || null; }

  function selectItems(){
    const api = getAPI();
    let imgs=[], vids=[];
    try {
      if(api && typeof api.getPremiumImages==='function') imgs = api.getPremiumImages();
      else if(api && typeof api.list==='function') imgs = api.list({type:'premiumImages'});
      if(api && typeof api.getPremiumVideos==='function') vids = api.getPremiumVideos();
    } catch(e){ console.warn('[thumbs] api error', e); }
    const all = [].concat(imgs.map(x=>({__type:'image', ...x})), vids.map(x=>({__type:'video', ...x})));
    return all.slice(0, GRID_LIMIT);
  }

  function urlFor(item){
    return item.thumb || item.preview || item.url || item.src || item.path || (item.name?('/uncensored/'+item.name):'#');
  }
  function isVideo(item){
    const u=urlFor(item);
    return item.__type==='video' || /\.mp4$|\.webm$/i.test(u);
  }

  function css(){
    const s=document.createElement('style');
    s.id='premium-thumbs-style';
    s.textContent = `
      /* ocultar laterales y galerías previas si existieran */
      #sidebar, .sidebar, .premium-sidebar, .menu-lateral, .left-menu { display:none !important; }
      .gallery, .full-gallery, .grid-full { display:none !important; }

      #premium-grid{max-width:1200px;margin:12px auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;padding:0 8px}
      #premium-grid .thumb{position:relative;background:#000;border-radius:10px;overflow:hidden}
      #premium-grid .imgwrap{position:relative}
      #premium-grid img.blur{width:100%;height:180px;object-fit:cover;filter:blur(10px) saturate(0.85);transform:scale(1.05);display:block}
      #premium-grid .overlay{position:absolute;left:0;right:0;bottom:0;padding:6px;background:linear-gradient(transparent, rgba(0,0,0,.6));display:flex;justify-content:space-between;align-items:flex-end}
      #premium-grid .price{color:#fff;font-size:12px;background:rgba(0,0,0,.5);padding:2px 6px;border-radius:6px}
      #premium-grid .pp{min-height:30px}
      #premium-grid .ad{grid-column:1 / -1}
      #premium-grid .ad-inner{height:90px;border:1px dashed #bbb;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:14px;color:#666;background:#fcfcfc}
    `;
    document.head.appendChild(s);
  }

  function adBlock(){
    const b=document.createElement('div');
    b.className='ad';
    b.innerHTML='<div class="ad-inner">ANUNCIO</div>';
    return b;
  }

  function buildTile(item, idx){
    const price = isVideo(item)? 0.30 : 0.10;
    const d=document.createElement('div'); d.className='thumb';
    const u=urlFor(item);
    d.innerHTML = `
      <div class="imgwrap">
        <img src="${u}" loading="lazy" class="blur" alt="">
        <div class="overlay">
          <div class="price">${price.toFixed(2)}€</div>
          <div class="pp" id="pp-${idx}"></div>
        </div>
      </div>`;
    // Montar botón PayPal por ítem (capture)
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
    const items = selectItems();
    if(!items.length){ console.warn('[thumbs] sin fuentes'); return; }
    grid.innerHTML='';
    items.forEach((it,i)=>{
      if(i>0 && (i%ADS_EVERY===0)) grid.appendChild(adBlock());
      grid.appendChild(buildTile(it,i));
    });
  }

  ready(function(){ css(); render(); });
})();
