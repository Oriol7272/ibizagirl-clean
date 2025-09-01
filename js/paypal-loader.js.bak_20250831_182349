(function(){
  var cid = window.PAYPAL_CLIENT_ID;
  var curr = window.PAYPAL_CURRENCY || 'EUR';
  var intent = (window.PAYPAL_INTENT === 'subscription') ? 'subscription' : 'capture';
  if (!cid) { console.error('[paypal-loader] Falta window.PAYPAL_CLIENT_ID'); return; }

  function ready(){
    try { document.dispatchEvent(new CustomEvent('paypal:sdk:ready', { detail: { intent: intent } })); }
    catch(e){}
  }

  if (window.paypal && window.paypal.Buttons){ ready(); return; }

  var qs = 'client-id='+encodeURIComponent(cid)+'&currency='+encodeURIComponent(curr)+'&components=buttons';
  if (intent === 'subscription'){ qs += '&intent=subscription&vault=true'; } else { qs += '&intent=capture'; }

  var s = document.createElement('script');
  s.src = 'https://www.paypal.com/sdk/js?' + qs;
  s.async = true;
  s.onload = function(){ console.log('[paypal-loader] SDK listo ('+intent+')'); ready(); };
  s.onerror = function(e){ console.error('[paypal-loader] Error cargando SDK', e); };
  document.head.appendChild(s);
})();
