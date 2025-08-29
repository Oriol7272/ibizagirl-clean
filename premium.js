(function(){
  const I18N=window.IBG_I18N;
  const t=(k)=>I18N.t(k);

  // ===== Prices from env =====
  function priceLabel(type){
    var P=(window.__IBG&&window.__IBG.PRICES)||{};
    return (type==='video') ? ("€"+(P.VIDEO_EUR||"0.30")) : ("€"+(P.IMAGE_EUR||"0.10"));
  }

  // ===== Lang UI =====
  function paintLangUI(){
    document.getElementById('title').textContent = t('premium_title');
    document.getElementById('note').textContent = t('lifetime_no_ads');
    document.getElementById('btn-monthly').textContent = t('monthly');
    document.getElementById('btn-yearly').textContent = t('yearly');
    document.getElementById('btn-lifetime').textContent = t('lifetime');
    document.getElementById('lang-label').textContent = t('lang_label')+':';
    document.getElementById('ads-disclaimer').textContent = t('ads_disclaimer');
  }
  function bindLang(){
    document.querySelectorAll('.langs button[data-lang]').forEach(b=>{
      b.classList.toggle('active', IBG_I18N.get()===b.dataset.lang);
      b.addEventListener('click', ()=>{
        IBG_I18N.set(b.dataset.lang);
        location.reload();
      });
    });
  }

  // ===== Utils =====
  function todayKey(){const d=new Date();return d.toISOString().slice(0,10);}
  function seededRng(seed){let x=0; for(let i=0;i<seed.length;i++) x = (x*31 + seed.charCodeAt(i))>>>0; return ()=> (x = (x*1664525+1013904223)>>>0) / 0x100000000; }
  function shuffle(a,r){for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function getUnlockKey(it){return 'ibg_unlock_'+it.id;}
  function isUnlocked(it){
    if(localStorage.getItem('ibg_lifetime')==='true') return true;
    if(localStorage.getItem('ibg_subscriber')==='true') return true;
    return localStorage.getItem(getUnlockKey(it))==='1';
  }
  function markUnlocked(it){localStorage.setItem(getUnlockKey(it),'1');}

  // ===== Collect premium pool from content-data3/4 =====
  function collectPremiumPool(){
    const out=[];
    const push=(o)=>{
      if(!o) return;
      if(typeof o==='string'){
        if(/uncensored\//i.test(o)) out.push({id:o,file:o,type:/\.(mp4|webm)$/i.test(o)?'video':'image'});
        return;
      }
      const f=o.file||o.src||'';
      if(!/uncensored\//i.test(f)) return;
      out.push({id:o.id||f,file:f,type:o.type||(/\.(mp4|webm)$/i.test(f)?'video':'image')});
    };
    for(const k in window){
      try{
        const v=window[k];
        if(Array.isArray(v) && v.length){
          const looks=v.some(it=>(typeof it==='string' && /uncensored\//i.test(it)) ||
            (it && typeof it==='object' && /(\/|^)uncensored\//i.test((it.file||it.src||''))));
          if(looks){ v.forEach(push); }
        }
      }catch(e){}
    }
    return out;
  }

  // ===== Render =====
  const gridEl = document.getElementById('grid');
  const statusEl = document.getElementById('status');

  function render(items){
    gridEl.innerHTML='';
    items.forEach((it,idx)=>{
      const card=document.createElement('article');
      card.className='card'+(isUnlocked(it)?' unlocked':'');
      const img=document.createElement('img');
      img.loading='lazy';
      img.alt='Premium';
      img.src=it.type==='image'? it.file : 'images/video-placeholder-blur.webp';
      card.appendChild(img);

      if(it.isNew){
        const b=document.createElement('div');
        b.className='badge';
        b.textContent=t('new');
        card.appendChild(b);
      }

      const price=document.createElement('div');
      price.className='price';
      price.dataset.type=it.type;
      price.textContent=priceLabel(it.type);
      card.appendChild(price);

      const pay=document.createElement('div');
      pay.className='paybox';
      const mount=document.createElement('div');
      mount.id='pp_'+idx;
      pay.appendChild(mount);
      card.appendChild(pay);

      card.addEventListener('click',()=>{
        if(card.classList.contains('unlocked')) return;
        card.classList.toggle('showpay');
        if(mount.dataset.ready==='1') return;
        mount.dataset.ready='1';
        setupPayPalButton(mount.id,it);
      });

      gridEl.appendChild(card);
    });
  }

  // ===== Daily selection: 100 items, 30% NEW =====
  function selectDaily(pool){
    const key='ibg_seed_'+todayKey();
    let seed=localStorage.getItem(key);
    if(!seed){ seed=Math.random().toString(36).slice(2); localStorage.setItem(key,seed); }
    const r=seededRng(seed);
    const imgs=pool.filter(x=>x.type==='image');
    const out=shuffle(imgs.slice(),r).slice(0,100);
    const n=Math.floor(out.length*0.30);
    out.forEach((x,i)=>{ x.isNew=i<n; });
    return out;
  }

  // ===== PayPal Buttons =====
  function setupPayPalButton(mountId,item){
    if(!window.paypal) return;
    var P=(window.__IBG&&window.__IBG.PRICES)||{};
    var val=(item.type==='video')?(P.VIDEO_EUR||"0.30"):(P.IMAGE_EUR||"0.10");
    paypal.Buttons({
      style:{layout:'horizontal',height:35,label:'pay'},
      createOrder:(d,a)=>a.order.create({
        purchase_units:[{amount:{currency_code:'EUR',value:String(val)}}]
      }),
      onApprove:(d,a)=>a.order.capture().then(()=>{
        markUnlocked(item);
        var el=document.getElementById(mountId)?.closest('.card');
        if(el){ el.classList.add('unlocked'); el.classList.remove('showpay'); }
      }),
      onError:(e)=>console.error('[paypal]',e)
    }).render('#'+mountId);
  }

  // ===== Plans & Lifetime =====
  function bindPlans(){
    var cfg=window.__IBG||{};
    var L=document.getElementById('btn-lifetime');
    var M=document.getElementById('btn-monthly');
    var Y=document.getElementById('btn-yearly');

    if(L){
      L.addEventListener('click',()=>{
        var P=(cfg.PRICES||{});
        var v=P.LIFETIME_EUR||"100.00";
        if(!window.paypal) return alert('PayPal SDK');
        paypal.Buttons({
          style:{layout:'horizontal',height:35,label:'pay'},
          createOrder:(d,a)=>a.order.create({
            purchase_units:[{amount:{currency_code:'EUR',value:String(v)}}]
          }),
          onApprove:(d,a)=>a.order.capture().then(()=>{
            localStorage.setItem('ibg_lifetime','true');
            location.reload();
          })
        }).render(L);
      });
    }

    if(M && cfg.PAYPAL_PLAN_MONTHLY_ID){
      M.addEventListener('click',()=>{
        paypal.Buttons({
          style:{layout:'horizontal',height:35,label:'subscribe'},
          createSubscription:(d,a)=>a.subscription.create({plan_id:cfg.PAYPAL_PLAN_MONTHLY_ID}),
          onApprove:()=>{ localStorage.setItem('ibg_subscriber','true'); location.reload(); }
        }).render(M);
      });
    }

    if(Y && cfg.PAYPAL_PLAN_ANNUAL_ID){
      Y.addEventListener('click',()=>{
        paypal.Buttons({
          style:{layout:'horizontal',height:35,label:'subscribe'},
          createSubscription:(d,a)=>a.subscription.create({plan_id:cfg.PAYPAL_PLAN_ANNUAL_ID}),
          onApprove:()=>{ localStorage.setItem('ibg_subscriber','true'); location.reload(); }
        }).render(Y);
      });
    }
  }

  // ===== Boot =====
  function boot(){
    paintLangUI();
    bindLang();

    const pool=collectPremiumPool();
    if(!pool.length){
      document.getElementById('status').textContent=t('error_no_pool');
      return;
    }
    render(selectDaily(pool));
    bindPlans();
  }

  if(document.readyState==='complete'||document.readyState==='interactive'){
    setTimeout(boot,50);
  }else{
    document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,50));
  }
})();
