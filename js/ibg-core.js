(function(){
  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function pickRandom(a,n){if(!Array.isArray(a))return[];const c=a.slice(0);shuffle(c);return c.slice(0,Math.max(0,Math.min(n,c.length)))}
  function isImgFilename(s){return typeof s==="string"&&/\.(jpe?g|png|webp|gif)$/i.test(s)}
  function fromObj(o){if(!o||typeof o!=="object")return null; if(o.src)return o.src; if(o.url)return o.url; if(o.path)return o.path; if(o.file)return o.file; return null}
  function withBase(folder,file){var b=(window.ENV&&window.ENV.IBG_ASSETS_BASE_URL)||"";if(!b){return folder+"/"+file}b=b.replace(/\/+$/,"");return b+"/"+folder+"/"+file}
  function normalize(list,folder){const out=[];if(!Array.isArray(list))return out;for(const it of list){if(typeof it==="string"){if(isImgFilename(it)){const src=(it.startsWith("http")||it.startsWith("/"))?it:withBase(folder,it);out.push({src})}}else if(typeof it==="object"){const f=fromObj(it);if(f){const src=(f.startsWith("http")||f.startsWith("/"))?f:withBase(folder,f);out.push({src})}}}return out}
  function fromUnified(folder){
    try{
      const U=window.UnifiedContentAPI;
      if(!U) return [];
      if(typeof U.get==="function"){const r=U.get(folder);if(Array.isArray(r))return normalize(r,folder)}
      if(typeof U.list==="function"){const r=U.list(folder);if(Array.isArray(r))return normalize(r,folder)}
      if(Array.isArray(U[folder])) return normalize(U[folder],folder);
      if(U.data && Array.isArray(U.data[folder])) return normalize(U.data[folder],folder);
    }catch(e){}
    return [];
  }
  function detect(folder){
    const u=fromUnified(folder); if(u.length) return u;
    const keys=[`CONTENT_${folder.toUpperCase()}`,folder.toUpperCase(),folder.toLowerCase(),`PUBLIC_${folder.toUpperCase()}`,`IBG_${folder.toUpperCase()}`,`CONTENT_DATA_${folder.toUpperCase()}`];
    for(const k of keys){if(Array.isArray(window[k]))return normalize(window[k],folder)}
    const cands=[];
    for(const [k,v] of Object.entries(window)){
      if(Array.isArray(v)&&v.length){
        const f=v[0];
        if(typeof f==="string"&&isImgFilename(f)){cands.push(normalize(v,folder))}
        else if(typeof f==="object"){if(f&&(f.folder===folder||fromObj(f))){cands.push(normalize(v,folder))}}
      }
    }
    cands.sort((a,b)=>b.length-a.length);
    return cands[0]||[];
  }
  function getFullList(){return detect("full")}
  function getUncensoredList(){return detect("uncensored")}
  function loadAds(){
    try{
      const E=window.ENV||{};
      const L=document.getElementById("ad-left");
      const R=document.getElementById("ad-right");
      function inject(el,html){if(el&&html){el.innerHTML=html}}
      if(E.JUICYADS_SNIPPET_B64){try{inject(L,atob(E.JUICYADS_SNIPPET_B64))}catch(e){}}
      if(E.EROADVERTISING_SNIPPET_B64){try{inject(R,atob(E.EROADVERTISING_SNIPPET_B64))}catch(e){}}
      if(E.ADS&&E.ADS.left){inject(L,E.ADS.left)}
      if(E.ADS&&E.ADS.right){inject(R,E.ADS.right)}
    }catch(e){}
  }
  window.IBG={shuffle,pickRandom,getFullList,getUncensoredList,loadAds};
})();
