(() => {
  const shuffle=(a)=>{ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]} return a; };
  const pick=(arr,n)=>shuffle([...arr]).slice(0,n);
  const adBlock=()=>{ const w=document.createElement('div'); w.className='ad'; const inner=document.createElement('div'); const E=window.IBG_ENV||{}; let ok=false; try{ if(E.EROADVERTISING_SNIPPET_B64){ inner.innerHTML=atob(E.EROADVERTISING_SNIPPET_B64); ok=true; } else if(E.JUICYADS_SNIPPET_B64){ inner.innerHTML=atob(E.JUICYADS_SNIPPET_B64); ok=true; } }catch(_){ } if(!ok) inner.innerHTML='<div style="padding:18px;text-align:center;color:#9bb">— Ad —</div>'; w.appendChild(inner); return w; };
  const srcOf=(it)=>{ const base=(window.IBG_ENV&&window.IBG_ENV.IBG_ASSETS_BASE_URL)||''; if(it.url) return it.url; if(it.path) return base? (base.replace(/\/$/,'')+'/'+it.path.replace(/^\//,'')) : it.path; if(it.file) return base? (base.replace(/\/$/,'')+'/uncensored/'+it.file) : ('/uncensored/'+it.file); return ''; };
  const collect=()=>{
    const U=window.UnifiedContentAPI;
    if(U&&U.list){
      const imgs=U.list({type:'image',collection:'uncensored'})||[];
      const vids=U.list({type:'video',collection:'uncensored-videos'})||[];
      return {imgs,vids};
    }
    const A=window.__IBG_PREMIUM_IMAGES||window.PREMIUM_IMAGES||[];
    const B=window.__IBG_PREMIUM_IMAGES_2||[];
    const V=window.__IBG_PREMIUM_VIDEOS||[];
    return {imgs:[...A,...B], vids:V};
  };
  window.__IBG_renderThumbs=()=>{
    const grid=document.getElementById('thumbs-grid'); if(!grid) return;
    const {imgs,vids}=collect();
    const pool=[...imgs.map(i=>({...i,__t:'img'})), ...vids.map(v=>({...v,__t:'vid'}))];
    if(!pool.length){ console.warn('[thumbs] sin fuentes'); return; }
    const items=pick(pool,100);
    const NEW=new Set(pick(items.map((_,i)=>i), Math.floor(items.length*0.30)));
    items.forEach((it,idx)=>{
      if(idx>0 && idx%10===0) grid.appendChild(adBlock());
      const card=document.createElement('div'); card.className='card';
      const img=document.createElement('img'); img.loading='lazy'; img.src=srcOf(it); img.alt=it.alt||''; card.appendChild(img);
      if(NEW.has(idx)){ const b=document.createElement('div'); b.className='badge'; b.textContent='NEW'; card.appendChild(b); }
      const overlay=document.createElement('div'); overlay.className='overlay'; const slot=document.createElement('div'); overlay.appendChild(slot); card.appendChild(overlay);
      grid.appendChild(card);
      window.__IBG_PremiumPay.renderThumb(slot, it.__t==='vid');
    });
  };
})();
