document.addEventListener('DOMContentLoaded', async () => {
  const full = IBG.getFullList();
  let bannerImages = [];
  try{
    const r = await fetch('./decorative-images.json',{cache:'no-store'});
    if(r.ok){ const arr = await r.json(); if(Array.isArray(arr) && arr.length) bannerImages = arr; }
  }catch(e){}
  if(!bannerImages.length){ bannerImages = IBG.pickRandom(full.map(x=>x.src), Math.min(6, full.length)); }
  const slides = document.querySelectorAll('#banner-rotator .banner-slide');
  let i = 0;
  function setSlide(idx){
    slides.forEach((el,k)=>el.classList.toggle('active', k===idx));
    if (bannerImages[idx]) slides[idx].style.backgroundImage = "url('"+bannerImages[idx]+"')";
    const other = (idx^1);
    const nextIdx = (idx+1) % (bannerImages.length||1);
    if (bannerImages[nextIdx]) slides[other].style.backgroundImage = "url('"+bannerImages[nextIdx]+"')";
  }
  setSlide(0);
  setInterval(()=>{ i = (i+1) % Math.max(1, bannerImages.length); setSlide(i); }, 4000);
  const track = document.getElementById('carousel-track');
  const items = IBG.pickRandom(full, Math.min(14, full.length));
  for(const it of items){
    const card = document.createElement('div');
    card.className = 'carousel-item';
    const img = document.createElement('img');
    img.loading = 'lazy'; img.decoding='async'; img.src = it.src;
    card.appendChild(img);
    track.appendChild(card);
  }
  document.getElementById('carousel-prev').addEventListener('click', ()=> track.scrollBy({left:-600, behavior:'smooth'}));
  document.getElementById('carousel-next').addEventListener('click', ()=> track.scrollBy({left: 600, behavior:'smooth'}));
  const grid = document.getElementById('gallery-grid');
  const gitems = IBG.pickRandom(full, Math.min(36, full.length));
  for(const it of gitems){
    const card = document.createElement('div'); card.className = 'card';
    const img = document.createElement('img'); img.loading = 'lazy'; img.decoding='async'; img.src = it.src;
    card.appendChild(img); grid.appendChild(card);
  }
  IBG.loadAds();
});
