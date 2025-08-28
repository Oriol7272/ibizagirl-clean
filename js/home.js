document.addEventListener('DOMContentLoaded', async () => {
  let rot = document.getElementById('banner-rotator');
  if(!rot){const host=document.querySelector('.banner')||document.body;rot=document.createElement('div');rot.id='banner-rotator';rot.className='banner-rotator';host.prepend(rot)}
  function ensureSlides(){let s=rot.querySelectorAll('.banner-slide');for(let i=s.length;i<2;i++){const d=document.createElement('div');d.className='banner-slide';rot.appendChild(d)}return rot.querySelectorAll('.banner-slide')}
  let slides = ensureSlides();

  const full = IBG.getFullList();
  async function getBannerList(){
    try{const r=await fetch('./decorative-images.json',{cache:'no-store'});if(r.ok){const arr=await r.json();if(Array.isArray(arr)&&arr.length)return arr}}catch(e){}
    return IBG.pickRandom(full.map(x=>x.src), Math.min(6, full.length));
  }
  const bannerImages = await getBannerList();
  let i=0;
  function setSlide(idx){
    slides=ensureSlides();
    if(!slides.length||!bannerImages.length){rot.classList.add('hidden');return}
    const curr=slides[idx%slides.length], next=slides[(idx+1)%slides.length];
    for(let k=0;k<slides.length;k++)slides[k].classList.toggle('active',slides[k]===curr);
    if(curr) curr.style.backgroundImage="url('"+bannerImages[idx%bannerImages.length]+"')";
    if(next) next.style.backgroundImage="url('"+bannerImages[(idx+1)%bannerImages.length]+"')";
  }
  setSlide(0); setInterval(()=>{i=(i+1)%Math.max(1,bannerImages.length);setSlide(i)},4000);

  const track=document.getElementById('carousel-track');
  const items=IBG.pickRandom(full,Math.min(14,full.length));
  for(const it of items){const c=document.createElement('div');c.className='carousel-item';const img=document.createElement('img');img.loading='lazy';img.decoding='async';img.src=it.src;c.appendChild(img);track.appendChild(c)}
  document.getElementById('carousel-prev').addEventListener('click',()=>track.scrollBy({left:-600,behavior:'smooth'}));
  document.getElementById('carousel-next').addEventListener('click',()=>track.scrollBy({left:600,behavior:'smooth'}));

  const grid=document.getElementById('gallery-grid');
  const gitems=IBG.pickRandom(full,Math.min(36,full.length));
  for(const it of gitems){const c=document.createElement('div');c.className='card';const img=document.createElement('img');img.loading='lazy';img.decoding='async';img.src=it.src;c.appendChild(img);grid.appendChild(c)}
  IBG.loadAds();
});
