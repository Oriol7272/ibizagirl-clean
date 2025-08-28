(function(){
  const BASE=(window.__ENV&&window.__ENV.BASE)||'https://ibizagirl.pics';
  const SOURCES=['content-data3.js','content-data4.js'];

  function buildUrl(name){
    const clean=(name||'').replace(/\.(webp|jpg|jpeg|png)$/i,'');
    const webp=BASE.replace(/\/$/,'')+'/uncensored/'+clean+'.webp';
    const jpg =BASE.replace(/\/$/,'')+'/uncensored/'+clean+'.jpg';
    return {webp,jpg};
  }

  async function loadNames(){
    let names=[];
    for(const src of SOURCES){
      try{
        const txt=await fetch(src,{cache:'no-store'}).then(r=>r.text());
        const found=[...txt.matchAll(/["'`]([A-Za-z0-9_-]{8,64})(?:\.(?:webp|jpg|jpeg|png))?["'`]/g)].map(m=>m[1]);
        names=names.concat(found);
      }catch(e){}
    }
    names=[...new Set(names)].filter(Boolean);
    return names.slice(0,100);
  }

  function renderCards(list){
    const grid=document.getElementById('premium-grid');
    if(!grid){console.warn('premium-grid no encontrado');return;}
    grid.innerHTML='';
    list.forEach((name)=>{
      const {webp,jpg}=buildUrl(name);
      const card=document.createElement('article');
      card.className='card';
      const img=new Image();
      img.loading='lazy';
      img.alt='Premium';
      img.src=webp;
      img.onerror=function(){ if(this.src!==jpg){ this.src=jpg; } };
      const lock=document.createElement('div');
      lock.className='lock';
      lock.textContent='Bloqueado';
      const price=document.createElement('div');
      price.className='price';
      price.innerHTML='<img alt="PayPal" src="images/paypal.svg"> 0,10€';
      card.appendChild(img);
      card.appendChild(lock);
      card.appendChild(price);
      grid.appendChild(card);
    });
  }

  async function main(){
    const list=await loadNames();
    console.log('[premium-thumbs] render:',list.length,'base:',BASE);
    renderCards(list);
  }

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',main);}else{main();}
})();
