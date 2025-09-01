export const messages = { es:{}, en:{} };

export let lang =
  (typeof localStorage !== 'undefined' && localStorage.getItem('ibg_lang')) ||
  (document?.documentElement?.getAttribute('lang')) ||
  'es';

export function t(key){
  try { return (messages[lang] && messages[lang][key]) || key } catch { return key }
}

export function setLang(next){
  lang = next;
  try { localStorage.setItem('ibg_lang', next) } catch {}
  try { document.documentElement.setAttribute('lang', next) } catch {}
}

export default { t, setLang, lang, messages };
