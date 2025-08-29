(function(){
  var ENV = window.__ENV||{};
  var exo = "5696328";
  var jzy = "1099637";
  // Inserta 3 slots visibles si hay ZONEs configuradas
  var container = document.getElementById("ads-premium") || (function(){
    var c = document.createElement("div"); c.id="ads-premium";
    c.style.cssText="max-width:1260px;margin:18px auto;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;";
    var anchor = document.querySelector(".hero,.page-title") || document.body;
    anchor.parentNode.insertBefore(c, anchor.nextSibling);
    return c;
  })();

  function mkSlot(){
    var d=document.createElement("div");
    d.className="ad-slot";
    d.style.cssText="min-height:250px;background:#0b0b0b;border-radius:12px;display:flex;align-items:center;justify-content:center;overflow:hidden";
    return d;
  }

  // ExoClick (300x250 iframe)
  if (exo){
    var d=mkSlot();
    d.innerHTML='<iframe src="https://syndication.exdynsrv.com/ads-iframe-display.php?idzone='+encodeURIComponent(exo)+'&output=1" '+
                'frameborder="0" scrolling="no" width="300" height="250"></iframe>';
    container.appendChild(d);
  }

  // JuicyAds (300x250 iframe)
  if (jzy){
    var d=mkSlot();
    d.innerHTML='<iframe src="https://adserver.juicyads.com/adshow.php?adzone='+encodeURIComponent(jzy)+'" '+
                'frameborder="0" scrolling="no" width="300" height="250"></iframe>';
    container.appendChild(d);
  }

  // Segundo y tercer slot duplicando proveedor disponible
  for (var i=0;i<2;i++){
    if (exo){
      var dx=mkSlot();
      dx.innerHTML='<iframe src="https://syndication.exdynsrv.com/ads-iframe-display.php?idzone='+encodeURIComponent(exo)+'&output=1" '+
                   'frameborder="0" scrolling="no" width="300" height="250"></iframe>';
      container.appendChild(dx);
    } else if (jzy){
      var dj=mkSlot();
      dj.innerHTML='<iframe src="https://adserver.juicyads.com/adshow.php?adzone='+encodeURIComponent(jzy)+'" '+
                   'frameborder="0" scrolling="no" width="300" height="250"></iframe>';
      container.appendChild(dj);
    }
  }
})();
