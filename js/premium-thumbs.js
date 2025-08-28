;(function(){
  var E=(window.IBG_ENV||{}), priceI=String(E.PAYPAL_ONESHOT_PRICE_EUR_IMAGE||'0.10'), priceV=String(E.PAYPAL_ONESHOT_PRICE_EUR_VIDEO||'0.30');
  function grid(){return document.querySelector('#thumbs,#premium-thumbs,.thumbs-grid,.grid-premium');}
  function isVid(n){ if(!n) return false; if(n.querySelector('video')) return true; var im=n.querySelector('img,source')||{}; var s=(im.currentSrc||im.src||'')+''; return /\.(mp4|webm|m3u8)$/i.test(s); }
  function overlay(node){
    if(!node||node.querySelector('.pp-overlay')) return;
    var ov=document.createElement('div'); ov.className='pp-overlay';
    var h=document.createElement('div'); h.className='pp-holder';
    var btn=document.createElement('button'); btn.type='button'; btn.className='pp-mini'; btn.textContent='Pagar '+(isVid(node)?priceV:priceI)+'€';
    h.appendChild(btn); ov.appendChild(h); node.appendChild(ov);
    btn.addEventListener('click', function(){
      var mount=document.createElement('div'); mount.className='pp-mount'; h.innerHTML=''; h.appendChild(mount);
      (window.__load_paypal_pay?window.__load_paypal_pay():Promise.resolve()).then(function(){
        if(!window.paypal){ alert('PayPal no cargó'); return; }
        var amount=isVid(node)?priceV:priceI;
        paypal.Buttons({
          style:{layout:'vertical',label:'pay',height:30,shape:'pill'},
          createOrder:function(_,a){return a.order.create({purchase_units:[{amount:{currency_code:'EUR',value:String(amount)}}]});},
          onApprove:function(_,a){return a.order.capture().then(function(){ alert('¡Pago completado!'); });}
        }).render(mount);
      });
    }, {once:true});
  }
  function ads(container,step){
    step=step||8;
    var code='';
    if(E.JUICYADS_SNIPPET_B64){try{code=atob(E.JUICYADS_SNIPPET_B64);}catch(_){}} 
    if(!code && E.EROADVERTISING_SNIPPET_B64){try{code=atob(E.EROADVERTISING_SNIPPET_B64);}catch(_){}}
    if(!code) return;
    var kids=[].slice.call(container.children), ins=0;
    for(var i=step;i<kids.length;i+=step){
      var slot=document.createElement('div'); slot.className='ad-slot'; slot.innerHTML=code;
      var ref=container.children[i+ins]; if(ref) container.insertBefore(slot,ref); ins++;
    }
  }
  function enhance(){
    var g=grid(); if(!g){ console.warn('[thumbs] sin contenedor'); return; }
    [].slice.call(g.children).forEach(overlay);
    ads(g,8);
    new MutationObserver(function(ms){ ms.forEach(function(m){[].slice.call(m.addedNodes||[]).forEach(function(n){ if(n.nodeType===1) overlay(n); });}); }).observe(g,{childList:true});
  }
  document.addEventListener('DOMContentLoaded', enhance);
})();
