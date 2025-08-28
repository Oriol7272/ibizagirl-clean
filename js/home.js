document.addEventListener('DOMContentLoaded', async () => {
  // Crear rotador si no existe; asegurar 2 slides siempre
  let rot = document.getElementById('banner-rotator');
  if(!rot){
    const host = document.querySelector('.banner') || document.body;
    rot = document.createElement('div'); rot.id='banner-rotator'; rot.className='banner-rotator';
    host.prepend(rot);
  }
  function ensureSlides(){
    let slides = rot.querySelectorAll('.banner-slide');
    for(let i = slides.length; i < 2; i++){
      const d = document.createElement('div'); d.className='banner-slide'; rot.appendChild(d);
    }
    return rot.querySelectorAll('.banner-slide');
  }
  let slides = ensureSlides();

  // Datos banner: decorative-images.json si existe; si no, fallback a 'full'
  const full = IBG.getFullList();
  async function getBannerList(){
    try{
      const r = await fetch('./decorative-images.json',{cache:'no-store'});
      if(r.ok){ const arr = await r.json(); if(Array.isArray(arr)&&arr.length) return arr; }
    }catch(e){}
    return IBG.pickRandom(full.map(x=>x.src), Math.min(6, full.length));
  }
  const bannerImages = await getBannerList();

  let idx = 0;
  function setSlide(i){
    slides = ensureSlides();
    if(!slides.length || !bannerImages.length){ rot.classList.add('hidden'); return; }
    const curr = slides[i % slides.length];
    const next = slides[(i+1) % slides.length];
    for (const s of slides) s.classList.remove('active');
    if (curr) { curr.classList.add('active'); curr.style.backgroundImage = "url('"+bannerImages[i % bannerImages.length]+"')"; }
    if (next) { next.style.backgroundImage = "url('"+bannerImages[(i+1) % bannerImages.length]+"')"; }
  }
  setSlide(0);
  setInterval(()=>{ idx = (idx+1) % Math.max(1, bannerImages.length); setSlide(idx); }, 4000);

  // Carrusel (14 aleatorias) y galería (36 aleatorias) desde 'full'
  const track = document.getElementById('carousel-track');
  if(track){
    const items = IBG.pickRandom(full, Math.min(14, full.length));
    for(const it of items){
      const card=document.createElement('div'); card.className='carousel-item';
      const img=document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.src=it.src;
      card.appendChild(img); track.appendChild(card);
    }
    const prev=document.getElementById('carousel-prev'), next=document.getElementById('carousel-next');
    prev && prev.addEventListener('click', ()=> track.scrollBy({left:-600,behavior:'smooth'}));
    next && next.addEventListener('click', ()=> track.scrollBy({left: 600,behavior:'smooth'}));
  }
  const grid = document.getElementById('gallery-grid');
  if(grid){
    const gitems = IBG.pickRandom(full, Math.min(36, full.length));
    for(const it of gitems){
      const card=document.createElement('div'); card.className='card';
      const img=document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.src=it.src;
      card.appendChild(img); grid.appendChild(card);
    }
  }

  IBG.loadAds();
  IBG.loadCrisp();
});
