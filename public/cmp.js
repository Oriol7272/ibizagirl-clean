(function(){
  const CMP_ID = 585;           // id arbitrario > 0
  const CMP_VERSION = 1;
  const COOKIE_DAYS = 365;

  // util
  const setCookie = (k,v,days)=>{ const d=new Date(Date.now()+days*864e5).toUTCString();
    document.cookie = k + "=" + v + "; path=/; Max-Age="+(days*86400)+"; Expires="+d+"; SameSite=Lax"; };

  const hasConsent = ()=> localStorage.getItem('ibgConsentV2');
  const saveConsent = (obj)=> localStorage.setItem('ibgConsentV2', JSON.stringify(obj||{}));

  // Cargar iabtcf/core
  async function loadIAB() {
    if (window.iabtcf) return window.iabtcf;
    await new Promise(ok=>{
      const s=document.createElement('script');
      s.src="https://cdn.jsdelivr.net/npm/@iabtcf/core@1.4.4/dist/iabtcf.min.js";
      s.async=true; s.onload=ok; s.onerror=ok; document.head.appendChild(s);
    });
    return window.iabtcf;
  }

  // Generar TCString
  async function buildTCString(consented){
    const iab = await loadIAB();
    const {TCModel, GVL, TCString} = iab;
    const gvl = new GVL(); await gvl.readyPromise;

    const m = new TCModel(gvl);
    m.cmpId = CMP_ID; m.cmpVersion = CMP_VERSION; m.consentScreen = 1; m.consentLanguage = 'ES';
    m.isServiceSpecific = true;    // servicio-first party
    m.useNonStandardStacks = true;

    // Propósitos mínimos para ads: 1,3,4,7,9,10 (ajustable)
    const purposes = [1,3,4,7,9,10];
    purposes.forEach(p => m.purposeLegitimateInterests.set(p, consented));
    purposes.forEach(p => m.purposeConsents.set(p, consented));

    // Special Features (1 geolocalización precisa, 2 identificación activa del device)
    m.specialFeatureOptins.set(1, consented);
    m.specialFeatureOptins.set(2, consented);

    // Consentir vendors (permite a la red decidir lo que sirve)
    gvl.vendorIds.forEach(id => {
      m.vendorConsents.set(id, consented);
      m.vendorLegitimateInterests.set(id, consented);
    });

    const tc = TCString.encode(m);
    setCookie('euconsent-v2', tc, COOKIE_DAYS);
    return {tc, gdprApplies: true};
  }

  // __tcfapi simple (getTCData / addEventListener / removeEventListener)
  const listeners = new Map(); let tcData = null, eventStatus = 'tcloaded';
  window.__tcfapi = function(cmd, ver, cb, arg){
    if (typeof cb !== 'function') return;
    if (cmd === 'addEventListener'){
      const id = Math.random().toString(36).slice(2);
      listeners.set(id, cb);
      cb({...tcData, eventStatus, cmpStatus:'loaded'}, true);
      return id;
    }
    if (cmd === 'removeEventListener' && arg){ listeners.delete(arg); cb(true); return; }
    if (cmd === 'getTCData'){ cb({...tcData, eventStatus, cmpStatus:'loaded'}, true); return; }
    if (cmd === 'ping'){ cb({gdprApplies:true, cmpLoaded:true, cmpStatus:'loaded'}, true); return; }
  };

  function broadcast(status){
    eventStatus = status || 'useractioncomplete';
    listeners.forEach(fn => { try { fn({...tcData, eventStatus, cmpStatus:'loaded'}, true); } catch(e){} });
  }

  // UI
  function banner(){
    if (document.getElementById('cmp-ibg')) return;
    const el = document.createElement('div');
    el.id = 'cmp-ibg';
    el.innerHTML = `
      <div class="cnt">
        <p>Usamos cookies para personalizar anuncios y medir su rendimiento. Puedes aceptar o rechazar. Siempre podrás cambiar tu elección en el pie.</p>
        <div class="btns">
          <button class="accept">Aceptar</button>
          <button class="reject">Rechazar</button>
          <button class="prefs">Preferencias</button>
        </div>
      </div>`;
    document.body.appendChild(el);

    el.querySelector('.accept').onclick = async ()=>{
      const {tc, gdprApplies} = await buildTCString(true);
      tcData = {tcString: tc, gdprApplies};
      saveConsent({consented:true, ts: Date.now()});
      el.remove(); broadcast('useractioncomplete');
    };
    el.querySelector('.reject').onclick = async ()=>{
      const {tc, gdprApplies} = await buildTCString(false);
      tcData = {tcString: tc, gdprApplies};
      saveConsent({consented:false, ts: Date.now()});
      el.remove(); broadcast('useractioncomplete');
    };
    el.querySelector('.prefs').onclick = ()=> alert('Preferencias detalladas próximamente. Puedes aceptar o rechazar ahora.');
  }

  async function initCMP(){
    // si ya hay elección previa, reconstruimos tcData y no mostramos banner
    const prev = hasConsent();
    if (prev){
      const chosen = JSON.parse(prev||'{}');
      const {tc, gdprApplies} = await buildTCString(!!chosen.consented);
      tcData = {tcString: tc, gdprApplies};
      broadcast('tcloaded');
      return true;
    }
    // primera visita: mostramos banner
    banner();
    return true;
  }

  // Exponer init para que el bootstrap lo use si quiere
  window.initCMP = initCMP;

  // Autoinit
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initCMP);
  } else {
    initCMP();
  }
})();
