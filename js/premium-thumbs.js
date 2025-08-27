(() => {
  const S_EXT=/\.(jpg|jpeg|png|webp|mp4)$/i;
  const looksPremiumPath=(p)=>/uncensored(-videos)?/i.test(p||'');
  const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a;};
  const pick=(arr,n)=>shuffle([...arr]).slice(0,n);
  const norm=(x)=>{
    if(typeof x==='string'){ return {src:x, type:/\.mp4$/i.test(x)?'vid':'img'}; }
    if(x && typeof x==='object'){
      const cand = x.url||x.path||x.file||x.src||'';
      if(cand) return {src:cand, type:/\.mp4$/i.test(cand)?'vid':'img'};
    }
    return null;
  };
  function crawlWindow(){
    const out=[];
    const seen=new Set();
    const push=(src)=>{
      if(!src) return;
      if(!S_EXT.test(src)) return;
      if(!looksPremiumPath(src)) return;
      if(seen.has(src)) return;
      seen.add(src);
      out.push(norm(src));
    };
    // 1) UnifiedContentAPI si existe
    const U=window.UnifiedContentAPI;
    try{
      if(U){
        const all = (U.getAll && U.getAll()) || (U.list && U.list({})) || [];
        const arr = Array.isArray(all)? all : (Array.isArray(all.items)? all.items : []);
        arr.forEach(it=>{
          const p=it?.url||it?.path||it?.file||it?.src;
          if(p) push(p);
        });
      }
    }catch(_){}
    // 2) Variables globales varias
    try{
      for(const k in window){
        const v = window[k];
        if(!v) continue;
        if(Array.isArray(v)){
          v.forEach(it=>{
            const n = norm(it);
            if(n) push(n.src);
          });
        }else if(typeof v==='object' && v.items && Array.isArray(v.items)){
          v.items.forEach(it=>{
            const n = norm(it);
            if(n) push(n.src);
          });
        }
      }
    }catch(_){}
    return out.filter(Boolean);
  }
  const buildSrc=(src)=>{
    const base=(window.IBG_ENV&&window.IBG_ENV.IBG_ASSETS_BASE_URL)||'';
    if(/^https?:\/\//i.test(src)) return src;
    if(base) return base.replace(/\/$/,'') + '/' + src.replace(/^\//,'');
    return src;
  };
  function adBlock(){
    const w=document.createElement('div'); w.className='ad'; const inner=document.createElement('div');
    try{
      const E=window.IBG_ENV||{};
      if(E.EROADVERTISING_SNIPPET_B64){ inner.innerHTML=atob(E.EROADVERTISING_SNIPPET_B64); }
      else if(E.JUICYADS_SNIPPET_B64){ inner.innerHTML=atob(E.JUICYADS_SNIPPET_B64); }
      else inner.innerHTML='<div style="padding:18px;text-align:center;color:#9bb">— Ad —</div>';
    }catch(_){ inner.innerHTML='<div style="padding:18px;text-align:center;color:#9bb">— Ad —</div>'; }
    w.appendChild(inner); return w;
  }
  window.__IBG_renderThumbs=()=>{
    const grid=document.getElementById('thumbs-grid'); if(!grid) return;
    let pool=crawlWindow().filter(Boolean);
    if(!pool.length){ console.warn('[thumbs] sin fuentes'); return; }
    const items=pick(pool,100);
    const NEW=new Set(pick(items.map((_,i)=>i), Math.floor(items.length*0.30)));
    items.forEach((it,idx)=>{
      if(idx>0 && idx%10===0) grid.appendChild(adBlock());
      const card=document.createElement('div'); card.className='card';
      const img=document.createElement('img'); img.loading='lazy'; img.src=buildSrc(it.src); img.alt='';
      card.appendChild(img);
      if(NEW.has(idx)){ const b=document.createElement('div'); b.className='badge'; b.textContent='NEW'; card.appendChild(b); }
      const overlay=document.createElement('div'); overlay.className='overlay'; const slot=document.createElement('div'); overlay.appendChild(slot); card.appendChild(overlay);
      grid.appendChild(card);
      window.__IBG_PremiumPay && window.__IBG_PremiumPay.renderThumb(slot, it.type==='vid');
    });
  };
})();
