/* HOME fixes: decorative-images → remap + fallback */
;(function(){
  // Ficheros reales existentes (según repo)
  var KNOWN = new Set([
    "1115ae7d-909f-4760-a3a1-037a05ad9931.jpg",
    "1618cbb2-8dd1-4127-99d9-d9f30536de72.jpg",
    "49830c0a-2fd8-439c-a583-02a9b039c4d6.jpg",
    "4bfb7a8b-8f1e-49d7-a610-90b83440b751.jpg",
    "81f55fd4-b0df-49f4-9020-cbb0f5042c08.jpg",
    "f062cb22-c99b-4dfa-9a79-572e98c6e75e.jpg",
    "paradise-beach.png"
  ]);

  var FALLBACK = "paradise-beach.png";

  // Remapeos conocidos (peticiones incorrectas → fichero real)
  var REMAP = {
    // Nombre mal escrito en el código → el de verdad del repo
    "115ae97d-909f-4760-a3a1-037a05ad9931.jpg": "1115ae7d-909f-4760-a3a1-037a05ad9931.jpg",
    // "Sütulo3.webp" (o URL-encoded) no existe → usa paradise-beach.png
    "S%C3%BCtulo3.webp": "paradise-beach.png",
    "Sütulo3.webp": "paradise-beach.png",
    "Sutulo3.webp": "paradise-beach.png"
  };

  function fileNameFrom(url){
    try{
      var u = new URL(url, location.href);
      var f = u.pathname.split("/").pop() || "";
      try{ return decodeURIComponent(f); }catch(_){ return f; }
    }catch(_){ return ""; }
  }
  function buildUrl(file){ return location.origin + "/decorative-images/" + file; }

  function remapName(name){
    if (REMAP[name]) return REMAP[name];
    // si no está en KNOWN, cae a fallback
    if (!KNOWN.has(name)) return FALLBACK;
    return name;
  }

  // IMG: si 404 → remap + retry; segundo fallo → ocultar
  window.addEventListener("error", function(ev){
    var el = ev.target;
    if (!el || el.tagName !== "IMG") return;
    if (el.src.indexOf("/decorative-images/") === -1) return;

    var bad = fileNameFrom(el.src);
    var good = remapName(bad);
    if (good !== bad) {
      var alt = buildUrl(good);
      console.warn("[home-fixes] remap IMG:", bad, "→", good);
      el.addEventListener("error", function hide(){ el.style.display="none"; }, {once:true});
      el.src = alt;
    } else {
      el.style.display="none";
    }
  }, true);

  // Backgrounds CSS: reescribir a URL válida si el nombre no existe
  function getBgUrl(el){
    var bi = getComputedStyle(el).backgroundImage || "";
    var m = bi.match(/url\\((['"]?)(.*?)\\1\\)/);
    return m ? m[2] : "";
  }
  function setBgUrl(el, url){ el.style.backgroundImage = 'url("' + url + '")'; }

  function fixBg(el){
    var src = getBgUrl(el);
    if (!src || src === "none") return;
    if (src.indexOf("/decorative-images/") === -1) return;
    var bad = fileNameFrom(src);
    var good = remapName(bad);
    if (good !== bad){
      var alt = buildUrl(good);
      console.warn("[home-fixes] remap BG:", bad, "→", good);
      setBgUrl(el, alt);
    }
  }

  document.addEventListener("DOMContentLoaded", function(){
    // aplica a contenedores típicos
    document.querySelectorAll("[data-decorative], .hero, header, .banner, .rotator, .hero-bg")
      .forEach(fixBg);
    console.log("[home-fixes] ready");
  });
})();
