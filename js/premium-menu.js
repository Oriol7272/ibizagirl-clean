;(function(){
  const env = (window.IBG_ENV||{});
  const PRICE = {
    ONE_IMAGE:  env.PAYPAL_ONESHOT_PRICE_EUR_IMAGE || '0.10',
    ONE_VIDEO:  env.PAYPAL_ONESHOT_PRICE_EUR_VIDEO || '0.30',
    PACK10:     env.PAYPAL_ONESHOT_PACK10_IMAGES_EUR || '0.99',
    PACK5V:     env.PAYPAL_ONESHOT_PACK5_VIDEOS_EUR  || '1.49',
    MONTHLY:    '14.99',
    ANNUAL:     '49.99',
    LIFETIME:   env.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME || '4.99'
  };
  let bar = document.getElementById('premium-topbar');
  if (!bar) { bar=document.createElement('div'); bar.id='premium-topbar'; document.body.prepend(bar); }
  bar.innerHTML = `
    <div class="ibg-premium-nav">
      <div class="left"><strong>IBIZA GIRL — Premium</strong></div>
      <div class="right">
        <button class="ibg-btn" data-action="pack10">Pack 10 imágenes · €${PRICE.PACK10}</button>
        <button class="ibg-btn" data-action="pack5v">Pack 5 vídeos · €${PRICE.PACK5V}</button>
        <button class="ibg-btn" data-action="monthly">Mensual · €${PRICE.MONTHLY}</button>
        <button class="ibg-btn" data-action="annual">Anual · €${PRICE.ANNUAL}</button>
        <button class="ibg-btn" data-action="lifetime">Lifetime · €${PRICE.LIFETIME}</button>
      </div>
    </div>
  `;
})();
