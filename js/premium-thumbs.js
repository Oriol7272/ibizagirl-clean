(function(){
  const e = (window.IBG_ENV||window.ENV||{});
  const assetsBase = (e.IBG_ASSETS_BASE_URL||'').replace(/\/$/,'');
  const grid = document.getElementById('premium-grid'); if(!grid) return;

  function looksMedia(x){
    return typeof x === 'string' && (/\.(webp|jpg|jpeg|png|gif|mp4|webm)$/i).test(x);
  }
  function pickFromObj(o){
    if(!o || typeof o!=='object') return null;
    if (typeof o.src==='string' && looksMedia(o.src)) return o.src;
    if (typeof o.file==='string' && looksMedia(o.file)) return o.file;
    if (typeof o.name==='string' && looksMedia(o.name)) return o.name;
    return null;
  }
  function collectImages(){
    // 1) Intento API unificada si existe
    try{
      const U = window.UnifiedContentAPI || window.ContentAPI || null;
      if (U && typeof U.getAll === 'function') {
        const arr = U.getAll('images') || [];
        const names = arr.map(a=> pickFromObj(a) || a).filter(looksMedia);
        if(names.length) return names;
      }
    }catch(_){}

    // 2) Escaneo de window para arrays "con pinta" de premium
    const picked = new Set();
    for (const k of Object.keys(window)) {
      const v = window[k];
      if (Array.isArray(v) && v.length>0 && /uncensored|premium|video|image/i.test(k)) {
        for (const it of v) {
          const p = (typeof it==='string' ? it : pickFromObj(it));
          if (p && looksMedia(p)) picked.add(p);
        }
      }
    }
    return [...picked];
  }

  function srcFor(name){
    if(!name) return '';
    if(/^https?:\/\//i.test(name)) return name;
    // Si ya viene con ruta completa, úsala tal cual
    if(/^\/?uncensored(-videos)?\//i.test(name)) return name.startsWith('/')? name : '/'+name;
    // Sino, asumimos uncensored (imagen) por defecto
    const base = assetsBase ? (assetsBase + '/uncensored/') : '/uncensored/';
    return base + name;
  }

  function cardHTML(name, isVideo, isNew){
    return `
      <div class="ibg-card ${isNew?'new':''}" data-pp-item data-kind="${isVideo?'video':'image'}" title="${name}">
        <img loading="lazy" src="${srcFor(name)}"
             onerror="this.onerror=null;this.src=this.src.replace('/uncensored/','/uncensored-videos/');"/>
        <div class="ibg-pay"></div>
      </div>`;
  }
  function adHTML(i){ return `<div class="ibg-ad" data-ad-slot="${i}">Publicidad</div>`; }

  const all = collectImages();
  if(!all.length){ console.warn('[thumbs] sin fuentes'); return; }

  const unique = Array.from(new Set(all));
  const shuffled = unique.sort(()=>Math.random()-0.5).slice(0,100);
  const markNewN = Math.floor(shuffled.length*0.30);
  const newSet = new Set(shuffled.slice(0, markNewN));
  let html='';
  shuffled.forEach((name,i)=>{
    const isVideo = /\.(mp4|webm)$/i.test(name) || /uncensored-videos\//i.test(name);
    html += cardHTML(name, isVideo, newSet.has(name));
    if((i+1)%8===0) html += adHTML(i+1);
  });
  grid.innerHTML = html;
  window.dispatchEvent(new CustomEvent('IBG_GRID_READY'));

  // Ads
  try{
    const exo   = e.EXOCLICK_ZONE || '';
    const juicy = e.JUICYADS_ZONE || '';
    document.querySelectorAll('.ibg-ad').forEach((box, idx)=>{
      if(juicy && idx%2===0){
        box.innerHTML = '<iframe style="border:0;width:100%;height:100%" src="https://juicyads.in/ads/'+juicy+'"></iframe>';
      }else if(exo && idx%2===1){
        const s=document.createElement('script'); s.src='https://a.exoclick.com/tag.php?zoneid='+exo;
        box.innerHTML=''; box.appendChild(s);
      }
    });
  }catch(e){ console.warn('[ads] fallo',e); }
})();
