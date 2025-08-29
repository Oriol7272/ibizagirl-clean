(() => {
  window.__ENV = {
    BASE: "https://ibizagirl.pics",
    PAYPAL_CLIENT_ID: "",
    PAYPAL_PLAN_ID_MONTHLY: "",
    PAYPAL_PLAN_ID_ANNUAL:  "",

    ONESHOT_PRICE_IMAGE_EUR:    "0.10",
    ONESHOT_PRICE_VIDEO_EUR:    "0.30",
    ONESHOT_PRICE_LIFETIME_EUR: "100.00",

    EXOCLICK_ZONE:       "",
    JUICYADS_ZONE:       "",
    EROADVERTISING_ZONE: "",
    POPADS_ENABLE:       "",
    POPADS_SITE_ID:      ""
  };
  console.info("[env-inline] window.__ENV", window.__ENV);
})();
