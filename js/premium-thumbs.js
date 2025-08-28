(() => {
  const BASE = (window.__ENV && window.__ENV.BASE) || "https://ibizagirl.pics";
  const grid = document.querySelector('.ibg-premium-grid');
  if (!grid) return;

  const L = (window.PREMIUM_PART1 || []).concat(window.PREMIUM_PART2 || []);

  function ensureWebp(name) {
    if (!name) return "";
    if (/\.webp$/i.test(name)) return name;
    return name.replace(/\.(jpe?g|png|gif)$/i, "") + ".webp";
  }
  const u = (folder, name) => `${BASE}/${folder}/${ensureWebp(name)}`;

  function card(name) {
    const wrap = document.createElement('div');
    wrap.className = 'ibg-card';

    const img = document.createElement('img');
    img.alt = '';
    img.loading = 'lazy';
    img.referrerPolicy = 'no-referrer';
    img.src = u('uncensored', name);
    img.onerror = () => { if (img.src.includes('/uncensored/')) img.src = u('full', name); };
    wrap.appendChild(img);

    const lock = document.createElement('div');
    lock.className = 'lock';
    lock.textContent = 'Bloqueado';
    wrap.appendChild(lock);

    const pp = document.createElement('div');
    pp.className = 'pp-buy';
    pp.dataset.paypal = 'subscription';
    // plan lo obtiene ibg-subscription.js de window.__ENV si está vacío
    wrap.appendChild(pp);

    return wrap;
  }

  grid.innerHTML = '';
  L.forEach(n => grid.appendChild(card(n)));

  console.log('[premium-thumbs] render:', L.length, 'base:', BASE);
})();
