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
