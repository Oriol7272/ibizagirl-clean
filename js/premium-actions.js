;(()=>{ 
  const E = window.__ENV || {};

  document.addEventListener('click', (ev)=>{
    const el = ev.target.closest('[data-pp-buy],[data-pp-pack-img],[data-pp-pack-vid],[data-pp-sub],[data-pp-lifetime]');
    if (!el) return;

    if (!window.IBGPay) { alert("PayPal aún no está listo."); return; }

    // Compra simple (imagen o vídeo individual)
    if (el.hasAttribute('data-pp-buy')) {
      ev.preventDefault();
      const type = el.getAttribute('data-type') || 'image';
      const v = (type==='video') ? (E.ONESHOT_PRICE_VIDEO_EUR || "0.30") : (E.ONESHOT_PRICE_IMAGE_EUR || "0.10");
      const label = el.getAttribute('data-label') || (type==='video' ? "Vídeo" : "Imagen");
      window.IBGPay.openBuy({ value:v, label, metadata:{button:"buy", type} });
      return;
    }

    // Pack 10 imágenes
    if (el.hasAttribute('data-pp-pack-img')) {
      ev.preventDefault();
      const v = E.PACK10_IMAGES_EUR || "0.80";
      const label = el.getAttribute('data-label') || "Pack 10 imágenes";
      window.IBGPay.openBuy({ value:v, label, metadata:{button:"pack10_images"} });
      return;
    }

    // Pack 5 vídeos
    if (el.hasAttribute('data-pp-pack-vid')) {
      ev.preventDefault();
      const v = E.PACK5_VIDEOS_EUR || "1.00";
      const label = el.getAttribute('data-label') || "Pack 5 vídeos";
      window.IBGPay.openBuy({ value:v, label, metadata:{button:"pack5_videos"} });
      return;
    }

    // Suscripciones
    if (el.hasAttribute('data-pp-sub')) {
      ev.preventDefault();
      const plan = el.getAttribute('data-plan') || "";
      const label = el.getAttribute('data-label') || "Suscripción";
      if (!plan) { alert("Plan no configurado"); return; }
      window.IBGPay.openSub({ planId: plan, label });
      return;
    }

    // Lifetime
    if (el.hasAttribute('data-pp-lifetime')) {
      ev.preventDefault();
      const v = (E.ONESHOT_PRICE_LIFETIME_EUR || "100.00");
      window.IBGPay.openLifetime({ value:v });
      return;
    }
  });
})();
