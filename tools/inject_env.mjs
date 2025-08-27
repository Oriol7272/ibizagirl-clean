// tools/inject_env.mjs
import fs from "fs";

function getenv(k, d="") {
  return (process.env[k] ?? d).toString();
}

const cfg = {
  PAYPAL_CLIENT_ID:               getenv("PAYPAL_CLIENT_ID"),
  PAYPAL_PLAN_MONTHLY_1499:       getenv("PAYPAL_PLAN_MONTHLY_1499"),
  PAYPAL_PLAN_ANNUAL_4999:        getenv("PAYPAL_PLAN_ANNUAL_4999"),
  PAYPAL_ONESHOT_PRICE_EUR_IMAGE: getenv("PAYPAL_ONESHOT_PRICE_EUR_IMAGE","0.10"),
  PAYPAL_ONESHOT_PRICE_EUR_VIDEO: getenv("PAYPAL_ONESHOT_PRICE_EUR_VIDEO","0.30"),
  PAYPAL_ONESHOT_PRICE_EUR_LIFETIME: getenv("PAYPAL_ONESHOT_PRICE_EUR_LIFETIME","100.00"),
  EXOCLICK_ZONE:       getenv("EXOCLICK_ZONE"),
  JUICYADS_ZONE:       getenv("JUICYADS_ZONE"),
  EROADVERTISING_ZONE: getenv("EROADVERTISING_ZONE"),
  POPADS_SITE_ID:      getenv("POPADS_SITE_ID"),
  CRISP_WEBSITE_ID:    getenv("CRISP_WEBSITE_ID"),
  IBG_ASSETS_BASE_URL: getenv("IBG_ASSETS_BASE_URL"),
};

fs.writeFileSync("js/env.js", `window.ENV = ${JSON.stringify(cfg,null,2)};\n`, "utf8");
console.log("✅ env.js generado con process.env");
