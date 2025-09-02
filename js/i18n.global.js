var I18N = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // js/i18n.js
  var i18n_exports = {};
  __export(i18n_exports, {
    T: () => T,
    lang: () => lang,
    setLang: () => setLang,
    t: () => t
  });
  var T = {
    ES: { home: "Home", premium: "Premium", videos: "V\xEDdeos", subs: "Suscripciones", lifetime: "Lifetime 100\u20AC (sin anuncios)", welcome: "Bienvenido al para\xEDso para tu disfrute", new: "NUEVO", buy: "Comprar", unlock: "Desbloquear", price_img: "0,10\u20AC", price_vid: "0,30\u20AC", subscribe: "Suscribirse", monthly: "Mensual 14,99\u20AC", annual: "Anual 49,99\u20AC", lifetime2: "Lifetime 100\u20AC (sin anuncios)" },
    EN: { home: "Home", premium: "Premium", videos: "Videos", subs: "Subscriptions", lifetime: "Lifetime \u20AC100 (no ads)", welcome: "Welcome to your paradise", new: "NEW", buy: "Buy", unlock: "Unlock", price_img: "\u20AC0.10", price_vid: "\u20AC0.30", subscribe: "Subscribe", monthly: "Monthly \u20AC14.99", annual: "Annual \u20AC49.99", lifetime2: "Lifetime \u20AC100 (no ads)" },
    FR: { home: "Accueil", premium: "Premium", videos: "Vid\xE9os", subs: "Abonnements", lifetime: "\xC0 vie 100\u20AC (sans pubs)", welcome: "Bienvenue au paradis", new: "NOUVEAU", buy: "Acheter", unlock: "D\xE9bloquer", price_img: "0,10\u20AC", price_vid: "0,30\u20AC", subscribe: "S\u2019abonner", monthly: "Mensuel 14,99\u20AC", annual: "Annuel 49,99\u20AC", lifetime2: "\xC0 vie 100\u20AC (sans pubs)" },
    DE: { home: "Start", premium: "Premium", videos: "Videos", subs: "Abos", lifetime: "Lifetime 100\u20AC (ohne Werbung)", welcome: "Willkommen im Paradies", new: "NEU", buy: "Kaufen", unlock: "Freischalten", price_img: "0,10\u20AC", price_vid: "0,30\u20AC", subscribe: "Abonnieren", monthly: "Monatlich 14,99\u20AC", annual: "J\xE4hrlich 49,99\u20AC", lifetime2: "Lifetime 100\u20AC (ohne Werbung)" },
    IT: { home: "Home", premium: "Premium", videos: "Video", subs: "Abbonamenti", lifetime: "Per sempre 100\u20AC (senza ads)", welcome: "Benvenuto in paradiso", new: "NUOVO", buy: "Compra", unlock: "Sblocca", price_img: "0,10\u20AC", price_vid: "0,30\u20AC", subscribe: "Abbonati", monthly: "Mensile 14,99\u20AC", annual: "Annuale 49,99\u20AC", lifetime2: "Per sempre 100\u20AC (senza ads)" }
  };
  var lang = () => localStorage.getItem("ibg_lang") || "ES";
  var setLang = (l) => (localStorage.setItem("ibg_lang", l), location.reload());
  var t = (k) => (T[lang()] || T.ES)[k] || k;
  return __toCommonJS(i18n_exports);
})();
