(function(){
  document.addEventListener('error', function(e){
    var t = e.target;
    if (t && t.tagName === 'IMG') {
      // Oculta thumb roto
      var card = t.closest('.thumb, .item, .card, li, div');
      if (card) card.style.display = 'none';
    }
  }, true);

  // Para vídeos: si no carga el poster o la fuente, oculta el contenedor
  document.addEventListener('loadstart', function(e){
    var v = e.target;
    if (v && v.tagName === 'VIDEO') {
      v.addEventListener('error', function(){
        var card = v.closest('.thumb, .item, .card, li, div');
        if (card) card.style.display = 'none';
      }, { once:true });
    }
  }, true);
})();
