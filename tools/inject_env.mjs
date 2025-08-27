// tools/inject_env.mjs
import fs from "fs";
import path from "path";

// Carga .env style KEY="value" o KEY=value
function loadEnvFile(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  const txt = fs.readFileSync(file, "utf8");
  for (const line of txt.split(/\r?\n/)) {
    const m =
      line.match(/^\s*([A-Z0-9_]+)\s*=\s*"(.*)"\s*$/) ||
      line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+)\s*$/);
    if (m) out[m[1]] = m[2].replace(/\\n/g, "\n");
  }
  return out;
}

const candidates = [
  path.join(".vercel", ".env.production.local"),
  path.join(".vercel", ".env.preview.local"),
  path.join(".vercel", ".env.development.local"),
  ".env",
];

// Merge de archivos locales y process.env (en Vercel)
let merged = {};
for (const f of candidates) if (fs.existsSync(f)) merged = { ...merged, ...loadEnvFile(f) };
const ENV = { ...merged, ...process.env };
const get = (k, d = "") => (ENV[k] ?? d).toString();

const cfg = {
  PAYPAL_CLIENT_ID:               get("PAYPAL_CLIENT_ID"),
  PAYPAL_PLAN_MONTHLY_1499:       get("PAYPAL_PLAN_MONTHLY_1499"),
  PAYPAL_PLAN_ANNUAL_4999:        get("PAYPAL_PLAN_ANNUAL_4999"),
  PAYPAL_ONESHOT_PRICE_EUR_IMAGE: get("PAYPAL_ONESHOT_PRICE_EUR_IMAGE", "0.10"),
  PAYPAL_ONESHOT_PRICE_EUR_VIDEO: get("PAYPAL_ONESHOT_PRICE_EUR_VIDEO", "0.30"),
  PAYPAL_ONESHOT_PRICE_EUR_LIFETIME: get("PAYPAL_ONESHOT_PRICE_EUR_LIFETIME", "100.00"),
  EXOCLICK_ZONE:       get("EXOCLICK_ZONE"),
  JUICYADS_ZONE:       get("JUICYADS_ZONE"),
  EROADVERTISING_ZONE: get("EROADVERTISING_ZONE"),
  POPADS_SITE_ID:      get("POPADS_SITE_ID"),
  CRISP_WEBSITE_ID:    get("CRISP_WEBSITE_ID"),
  IBG_ASSETS_BASE_URL: get("IBG_ASSETS_BASE_URL"),
};

const out = `window.ENV = ${JSON.stringify(cfg, null, 2)};\n`;
fs.writeFileSync("js/env.js", out, "utf8");
console.log("ok env.js (inject_env.mjs)");
