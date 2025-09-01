/* === canonical i18n (generado) === */
export const lang =
  (typeof window!=="undefined" && (window.IBG_LANG || document.documentElement.getAttribute("lang"))) || "es";

export function setLang(next) {
  try {
    const v = (next || "").toString().trim() || "es";
    if (typeof document !== "undefined") document.documentElement.setAttribute("lang", v);
    if (typeof window !== "undefined") window.IBG_LANG = v;
  } catch (_) {}
  return (typeof window!=="undefined" ? window.IBG_LANG : lang) || "es";
}

// compat: también export default
export default lang;

// side-effect: dejar IBG_LANG listo
try { if (typeof window!=="undefined") window.IBG_LANG = window.IBG_LANG || lang; } catch (_){}

/* === FIX i18n exports (20250831_192301) === */
export let lang = (typeof localStorage!==undefined && localStorage.getItem(ibg_lang)) || (document?.documentElement?.getAttribute(lang)||es);
export function setLang(l){
  try{ lang = l; if(typeof localStorage!==undefined){ localStorage.setItem(ibg_lang, l); } }catch(_){ }
  try{ document?.documentElement?.setAttribute(lang, l); }catch(_){ }
}
export function t(key){
  try{
    const dict = (window.IBG_I18N && window.IBG_I18N[lang]) || {};
    return (dict[key] ?? key);
  }catch(_){ return key; }
}
/* === /FIX i18n === */
