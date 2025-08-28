;(function(){
  var E=(window.IBG_ENV||{});
  function el(t,c){var e=document.createElement(t);if(c)e.className=c;return e;}
  function removeDupes(){
    var ms=document.querySelectorAll('#premium-topbar, [data-legacy-menu], .premium-topbar-legacy');
    ms.forEach(function(n,i){ if(i>0 || n.hasAttribute('data-legacy-menu')) n.remove(); });
  }
  function ensureTopbar(){
    var ex=document.querySelector('#premium-topbar'); if(ex) return ex;
    var bar=el('div','ibg-topbar'); bar.id='premium-topbar';
    bar.innerHTML=[
      '<div class="inner">',
        '<div class="brand">Premium</div>',
        '<div class="actions" id="ibg-plan-actions">',
          '<button class="ibg-btn" data-plan="monthly">Mensual <small>14,99€</small></button>',
          '<button class="ibg-btn" data-plan="annual">Anual <small>49,99€</small></button>',
          '<button class="ibg-btn" data-plan="lifetime">Lifetime</button>',
          '<button class="ibg-btn" data-plan="pack10">Pack 10 imágenes</button>',
          '<button class="ibg-btn" data-plan="pack5v">Pack 5 vídeos</button>',
        '</div>',
      '</div>'
    ].join('');
    document.body.prepend(bar); return bar;
  }
  function wire(){
    var w=document.querySelector('#ibg-plan-actions'); if(!w) return;
    var map={
      monthly:E.PAYPAL_PLAN_MONTHLY_1499,
      annual:E.PAYPAL_PLAN_ANNUAL_4999,
      lifetime:E.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME,
      pack10:E.PAYPAL_ONESHOT_PACK10_IMAGES_EUR,
      pack5v:E.PAYPAL_ONESHOT_PACK5_VIDEOS_EUR || E.PAYPAL_ONESHOT_PACKS_VIDEOS_EUR
    };
    [].slice.call(w.querySelectorAll('button[data-plan]')).forEach(function(b){
      var k=b.getAttribute('data-plan'); if(!map[k]) b.style.display='none';
    });
    if(map.monthly||map.annual){
      (window.__load_paypal_subs?window.__load_paypal_subs():Promise.resolve()).then(function(){
        [['monthly',map.monthly],['annual',map.annual]].forEach(function(p){
          var k=p[0], id=p[1], btn=w.querySelector('button[data-plan="'+k+'"]');
          if(!btn||!id) return;
          btn.addEventListener('click', function(){
            paypal.Buttons({
              style:{layout:'horizontal',label:'subscribe',height:32,shape:'pill'},
              createSubscription:function(_,a){return a.subscription.create({plan_id:id});},
              onApprove:function(){ alert('¡Suscripción activada!'); }
            }).render(btn);
          }, {once:true});
        });
      });
    }
    var priceI=String(E.PAYPAL_ONESHOT_PRICE_EUR_IMAGE||'0.10');
    var priceV=String(E.PAYPAL_ONESHOT_PRICE_EUR_VIDEO||'0.30');
    if(map.lifetime||map.pack10||map.pack5v){
      (window.__load_paypal_pay?window.__load_paypal_pay():Promise.resolve()).then(function(){
        [['lifetime',String(map.lifetime||'')],['pack10',String(map.pack10||'')],['pack5v',String(map.pack5v||'')]].forEach(function(p){
          var k=p[0], amount=p[1], btn=w.querySelector('button[data-plan="'+k+'"]');
          if(!btn||!amount) return;
          btn.addEventListener('click', function(){
            paypal.Buttons({
              style:{layout:'horizontal',label:'pay',height:32,shape:'pill'},
              createOrder:function(_,a){return a.order.create({purchase_units:[{amount:{currency_code:'EUR',value:String(amount)}}]});},
              onApprove:function(_,a){return a.order.capture().then(function(){ alert('Pago correcto'); });}
            }).render(btn);
          }, {once:true});
        });
      });
    }
  }
  document.addEventListener('DOMContentLoaded', function(){
    removeDupes(); ensureTopbar(); wire();
    var lateral=document.querySelector('.premium-sidebar,.sidebar,#premium-sidebar'); if(lateral) lateral.style.display='none';
  });
})();
