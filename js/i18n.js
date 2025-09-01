/**
 * i18n con API retrocompatible:
 *  - lang() -> devuelve el idioma actual (lo que pages-common espera)
 *  - setLang(next), t(key), messages
 */
const _d = (typeof document !== 'undefined') ? document : null;
const _ls = (typeof localStorage !== 'undefined') ? localStorage : null;

let _lang =
  (_ls && _ls.getItem('ibg_lang')) ||
  (_d && _d.documentElement && _d.documentElement.getAttribute('lang')) ||
  'es';

export function lang(){ return _lang; }

export const messages = (typeof window !== 'undefined' && window.IBG_MESSAGES) || { es:{}, en:{} };

export function t(key){
  try { return (messages[_lang] && messages[_lang][key]) || key } catch { return key }
}

export function setLang(next){
  _lang = next;
  try { _ls && _ls.setItem('ibg_lang', next) } catch {}
  try { _d && _d.documentElement && _d.documentElement.setAttribute('lang', next) } catch {}
}

export default { t, setLang, lang, messages };
