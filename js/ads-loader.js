// hardened ads-loader (auto)
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function q(sel){ try{ return document.querySelector(sel)||null; }catch(_){ return null; } }
  function G(k, d){ try{ return (window && window[k]) ? window[k] : d; }catch(_){ return d; } }
  ready(function(){
    try{
      var slot=q('[data-ad-slot]'); if(!slot){ console.info('[ads] sin slot visible'); return; }

      var ja_id=G('JUICYADS_ZONE',''); var ja_b64=G('JUICYADS_SNIPPET_B64','');
      if(ja_id && ja_b64){ try{ var s=document.createElement('script'); s.defer=true; s.innerHTML=atob(ja_b64); slot.appendChild(s);}catch(e){console.warn('[ads] juicy',e);} }

      var exo=G('EXOCLICK_ZONE',''); if(exo){ try{ var d=document.createElement('div'); d.setAttribute('data-exo-zone',exo); slot.appendChild(d); var se=document.createElement('script'); se.src='https://a.exoclick.com/tag.php'; se.async=true; slot.appendChild(se);}catch(e){console.warn('[ads] exo',e);} }

      var eroz=G('EROADVERTISING_ZONE',''); if(eroz){ try{ var sc=document.createElement('script'); sc.async=true; sc.src='https://a.magsrv.com/ad-provider.js'; sc.setAttribute('data-zone',eroz); slot.appendChild(sc);}catch(e){console.warn('[ads] eroadv',e);} }
    }catch(e){ console.warn('[ads] error',e); }
  });
})();
