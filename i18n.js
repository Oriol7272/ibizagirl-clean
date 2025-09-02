(function(){ if (window.__IBG_I18N_GUARD__) return; window.__IBG_I18N_GUARD__=1;
/* === canonical i18n (generado) === */
window.lang =
  (typeof window!=="undefined" && (window.IBG_LANG || document.documentElement.getAttribute("lang"))) || "es";
window.setLang = function(next) {
  try {
    const v = (next || "").toString().trim() || "es";
    if (typeof document !== "undefined") document.documentElement.setAttribute("lang", v);
    if (typeof window !== "undefined") window.IBG_LANG = v;
  } catch (_) {}
  return (typeof window!=="undefined" ? window.IBG_LANG : lang) || "es";
}

// compat: también window.I18N=
window.__default_export = lang;

// side-effect: dejar IBG_LANG listo
try { if (typeof window!=="undefined") window.IBG_LANG = window.IBG_LANG || lang; } catch (_){}
})(); // __IBG_I18N_GUARD__
