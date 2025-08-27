(function(){
  // Marca de página premium para scoping de CSS/JS y no tocar HOME
  if(!document.body.classList.contains('premium-page')){
    document.body.classList.add('premium-page');
  }
  // Si hay menús previos con nuestros IDs duplicados, deja sólo el primero
  const navs=[...document.querySelectorAll('#premium-topmenu')];
  if(navs.length>1){ navs.slice(1).forEach(n=>n.remove()); }
})();
