window.IBG_I18N=(function(){
  const dict={
    es:{premium_title:"Premium • Fotos exclusivas",new:"Nuevo",unlock:"Desbloquear",unlocked:"Desbloqueada",price_img:"€0,10",price_vid:"€0,30",subscribe:"Suscribirse",monthly:"Mensual €14,99",yearly:"Anual €49,99",lifetime:"Lifetime €100",lifetime_no_ads:"✅ Sin anuncios para cuentas Lifetime",all_access:"Acceso a todo",loading:"Cargando contenido…",error_no_pool:"No hay contenido premium disponible.",lang_label:"Idioma",pay_with_paypal:"Pagar con PayPal",ads_disclaimer:"Publicidad (oculta para Lifetime)"},
    en:{premium_title:"Premium • Exclusive photos",new:"New",unlock:"Unlock",unlocked:"Unlocked",price_img:"€0.10",price_vid:"€0.30",subscribe:"Subscribe",monthly:"Monthly €14.99",yearly:"Yearly €49.99",lifetime:"Lifetime €100",lifetime_no_ads:"✅ Ads removed for Lifetime",all_access:"All access",loading:"Loading content…",error_no_pool:"No premium content available.",lang_label:"Language",pay_with_paypal:"Pay with PayPal",ads_disclaimer:"Advertisements (hidden for Lifetime)"},
    fr:{premium_title:"Premium • Photos exclusives",new:"Nouveau",unlock:"Débloquer",unlocked:"Débloquée",price_img:"0,10 €",price_vid:"0,30 €",subscribe:"S’abonner",monthly:"Mensuel 14,99 €",yearly:"Annuel 49,99 €",lifetime:"Lifetime 100 €",lifetime_no_ads:"✅ Pas de pubs pour Lifetime",all_access:"Accès total",loading:"Chargement…",error_no_pool:"Aucun contenu premium disponible.",lang_label:"Langue",pay_with_paypal:"Payer avec PayPal",ads_disclaimer:"Publicités (masquées pour Lifetime)"},
    it:{premium_title:"Premium • Foto esclusive",new:"Nuovo",unlock:"Sblocca",unlocked:"Sbloccata",price_img:"€0,10",price_vid:"€0,30",subscribe:"Abbonati",monthly:"Mensile €14,99",yearly:"Annuale €49,99",lifetime:"Lifetime €100",lifetime_no_ads:"✅ Niente pubblicità per Lifetime",all_access:"Accesso completo",loading:"Caricamento…",error_no_pool:"Nessun contenuto premium disponibile.",lang_label:"Lingua",pay_with_paypal:"Paga con PayPal",ads_disclaimer:"Annunci (nascosti per Lifetime)"},
    ca:{premium_title:"Premium • Fotos exclusives",new:"Nou",unlock:"Desbloqueja",unlocked:"Desbloquejada",price_img:"0,10 €",price_vid:"0,30 €",subscribe:"Subscriu-t’hi",monthly:"Mensual 14,99 €",yearly:"Anual 49,99 €",lifetime:"Lifetime 100 €",lifetime_no_ads:"✅ Sense anuncis per a Lifetime",all_access:"Accés total",loading:"Carregant…",error_no_pool:"No hi ha contingut premium disponible.",lang_label:"Idioma",pay_with_paypal:"Paga amb PayPal",ads_disclaimer:"Anuncis (amagats per a Lifetime)"},
  };
  const key="ibg_lang";
  function get(){return localStorage.getItem(key)||"es";}
  function set(lang){localStorage.setItem(key,lang);}
  function t(k){const L=get();return (dict[L]&&dict[L][k])||dict.es[k]||k;}
  return {get,set,t,dict};
})();
