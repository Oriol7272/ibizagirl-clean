(function(){
  const env = (window.IBG_ENV||{});
  const assetsBase = (env.IBG_ASSETS_BASE_URL || '').replace(/\/$/,'');
  const grid = document.getElementById('premium-grid');
  if(!grid) return;

  function collectImages(){
    const P1 = window.UNCENSORED_PART1 || window.PREMIUM_IMAGES_1 || [];
    const P2 = window.UNCENSORED_PART2 || window.PREMIUM_IMAGES_2 || [];
    const ARR = (Array.isArray(P1)?P1:[]).concat(Array.isArray(P2)?P2:[]);
    return ARR;
  }
  function srcFor(name){
    if(!name) return '';
    if(/^https?:\/\//i.test(name)) return name;
    if(assetsBase) return assetsBase + '/uncensored/' + name;
    return '/uncensored/' + name;
  }
  function cardHTML(name, isVideo, isNew){
    return `
      <div class="ibg-card ${isNew?'new':''}" data-pp-item data-kind="${isVideo?'video':'image'}">
        <img loading="lazy" src="${srcFor(name)}"
             onerror="this.onerror=null; if(this.src.indexOf('/uncensored/')>-1){this.src=this.src.replace('/uncensored/','/uncensored-videos/')}"/>
        <div class="ibg-pay"></div>
      </div>`;
  }
  function adHTML(idx){
    return `<div class="ibg-ad" data-ad-slot="${idx}">Publicidad</div>`;
  }

  const all = collectImages();
  if(!all.length){ console.warn('[thumbs] sin fuentes'); return; }

  const names = all.map(x=> (x.file||x.name||x.src||x)+'');
  const shuffled = names.sort(()=>Math.random()-0.5).slice(0,100);
  const markNewN = Math.floor(shuffled.length*0.30);
  const newSet = new Set(shuffled.slice(0, markNewN));

  let html='';
  shuffled.forEach((name,i)=>{
    const isVideo = /\.mp4$/i.test(name);
    html += cardHTML(name, isVideo, newSet.has(name));
    if((i+1)%8===0){ html += adHTML(i+1); }
  });
  grid.innerHTML = html;

  // Señal de listo para que premium-paypal enganche botones por item
  window.dispatchEvent(new CustomEvent('IBG_GRID_READY'));

  // Inyectar ads si hay variables
  try{
    const exo   = env.EXOCLICK_ZONE || '';
    const juicy = env.JUICYADS_ZONE || '';
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
