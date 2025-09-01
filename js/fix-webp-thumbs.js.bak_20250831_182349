document.addEventListener('DOMContentLoaded',()=>{
  const fix = img => { if(img && img.src && /\.webp\.webp($|\?)/.test(img.src)) img.src = img.src.replace(/\.webp\.webp(?=$|\?)/,'.webp'); };
  document.querySelectorAll('.ibg-premium-grid img').forEach(fix);
  const mo=new MutationObserver(muts=>muts.forEach(m=>m.addedNodes.forEach(n=>{
    if(n.nodeType===1){
      if(n.tagName==='IMG') fix(n);
      n.querySelectorAll && n.querySelectorAll('img').forEach(fix);
    }
  })));
  mo.observe(document.body,{childList:true,subtree:true});
});
