// ==== Ads Loader ====
// Inserta 4 anuncios por lateral: JuicyAds, ExoClick, EroAdvertising y PopAds

function loadJuicyAds(target) {
  const boot = document.createElement("script");
  boot.src = "https://poweredby.jads.co/js/jads.js";
  boot.async = true;
  boot.dataset.cfasync = "false";
  document.body.appendChild(boot);

  const ins = document.createElement("ins");
  ins.id = "1099637";
  ins.dataset.width = "300";
  ins.dataset.height = "250";
  target.appendChild(ins);

  const run = document.createElement("script");
  run.innerHTML = "(adsbyjuicy = window.adsbyjuicy || []).push({'adzone':1099637});";
  target.appendChild(run);
}

function loadExoClick(target) {
  const s = document.createElement("script");
  s.src = "https://a.magsrv.com/ad-provider.js";
  s.async = true;
  target.appendChild(s);

  const ins = document.createElement("ins");
  ins.className = "eas6a97888e2";
  ins.dataset.zoneid = "5696328";
  target.appendChild(ins);

  const run = document.createElement("script");
  run.innerHTML = '(AdProvider = window.AdProvider || []).push({"serve": {}});';
  target.appendChild(run);
}

function loadEroAdvertising(target) {
  // contenedor requerido
  const div = document.createElement("div");
  div.id = "sp_8177575_node";
  target.appendChild(div);

  // usar https para evitar mixed content
  const s = document.createElement("script");
  s.type = "text/javascript";
  s.charset = "utf-8";
  s.src = "https://go.easrv.cl/loadeactrl.go?pid=152716&spaceid=8177575&ctrlid=798544";
  document.body.appendChild(s);
}

function loadPopAds(target) {
  const s = document.createElement("script");
  s.dataset.cfasync = "false";
  s.innerHTML = `(function(){var p=window,j="e494ffb82839a29122608e933394c091",d=[["siteId",4245161],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],v=["d3d3LnByZW1pdW12ZXJ0aXNpbmcuY29tL3pTL2J3ZHZmL3R0YWJsZXRvcC5taW4uanM="],e=-1,a,y,m=function(){clearTimeout(y);e++;if(v[e]){a=p.document.createElement("script");a.type="text/javascript";a.async=!0;var s=p.document.getElementsByTagName("script")[0];a.src="https://"+atob(v[e]);a.crossOrigin="anonymous";s.parentNode.insertBefore(a,s)}};if(!p[j]){try{Object.freeze(p[j]=d)}catch(e){}m()}})();`;
  target.appendChild(s);
}

window.addEventListener("DOMContentLoaded", () => {
  const left = document.getElementById("ads-left");
  const right = document.getElementById("ads-right");
  if (!left || !right) return;

  const loaders = [loadJuicyAds, loadExoClick, loadEroAdvertising, loadPopAds];

  loaders.forEach(fn => fn(left));
  loaders.forEach(fn => fn(right));
});
