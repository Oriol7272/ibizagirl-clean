(function(){
  const BASE=(window.__ENV&&window.__ENV.BASE)||'https://ibizagirl.pics';
  const SOURCES=['content-data3.js','content-data4.js'];
  function toUrl(name){
    const clean=(name||'').replace(/\.webp$/i,'');
    return BASE.replace(/\/$/,'')+'/uncensored/'+clean+'.webp';
  }
  async function loadNames(){
    let names=[];
    for(const src of SOURCES){
      try{
        const txt=await fetch(src,{cache:'no-store'}).then(r=>r.text());
        const rx=/\/uncensored\/([A-Za-z0-9_-]{8,128})\.webp/gi;
        let m; while((m=rx.exec(txt))!==null){ names.push(m[1]); }
      }catch(_){}
    }
    names=[...new Set(names)].filter(Boolean);
    return names.slice(0,100);
  }
  function render(list){
    const grid=document.getElementById('premium-grid');
    if(!grid){ console.warn('premium-grid no encontrado'); return; }
    grid.innerHTML='';
    list.forEach(name=>{
      const url=toUrl(name);
      const card=document.createElement('article');
      card.className='premium-card';
      const img=new Image();
      img.loading='lazy';
      img.alt='premium';
      img.src=url;
      const overlay=document.createElement('div');
      overlay.className='overlay';
      overlay.innerHTML='<span class="pp">€0,10</span>';
      card.appendChild(img);
      card.appendChild(overlay);
      grid.appendChild(card);
    });
  }
  async function main(){
    const list=await loadNames();
    console.log('[premium-thumbs] render:',list.length,'base:',BASE);
    render(list);
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',main);}else{main();}
})();
