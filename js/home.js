/* home bootstrap bridge (no-op si ya existe lógica en /js/pages/home.js) */
document.addEventListener('DOMContentLoaded', function(){
  // Si hay initHome en módulos, lo intentamos
  try {
    if (window.initHome) { window.initHome(); }
  } catch(e){}
  console.log('[HOME] bridge loaded');
});
