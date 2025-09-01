(function () {
  function tryJuicy() {
    try {
      var slots = document.querySelectorAll('ins#1099637');
      if (slots.length && window.adsbyjuicy) {
        // Empuja una vez por slot
        slots.forEach(function(){ (window.adsbyjuicy = window.adsbyjuicy || []).push({ adzone: 1099637 }); });
        console.log('[ADS] Juicy pushed on', slots.length, 'slots');
        return true;
      }
    } catch (e) {}
    return false;
  }

  function tryExo() {
    try {
      var slots = document.querySelectorAll('ins.eas6a97888e2[data-zoneid="5696328"]');
      if (slots.length && window.AdProvider) {
        (window.AdProvider = window.AdProvider || []).push({ serve: {} });
        console.log('[ADS] ExoClick served on', slots.length, 'slots');
        return true;
      }
    } catch (e) {}
    return false;
  }

  function tryEro() {
    try {
      if (window.eaCtrl) {
        // Asegura que ambos slots están registrados
        eaCtrl.add({"display":"sp_8177575_node_left","sid":8177575,"plugin":"banner"});
        eaCtrl.add({"display":"sp_8177575_node_right","sid":8177575,"plugin":"banner"});
        console.log('[ADS] EroAdvertising ctrl ok');
        return true;
      }
    } catch (e) {}
    return false;
  }

  var attempts = 0;
  var timer = setInterval(function () {
    attempts++;
    var ok = tryJuicy() & tryExo() & tryEro();
    if (ok || attempts > 20) clearInterval(timer);
  }, 800);
})();
