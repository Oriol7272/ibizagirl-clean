export default function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.status(200).json({
    BASE: process.env.IBG_ASSETS_BASE_URL || process.env.BASE || '',
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || '',
    PAYPAL_PLAN_MONTHLY: process.env.PAYPAL_PLAN_MONTHLY_1499 || process.env.PAYPAL_PLAN_ID_MONTHLY || '',
    PAYPAL_PLAN_ANNUAL: process.env.PAYPAL_PLAN_ANNUAL_4999 || process.env.PAYPAL_PLAN_ID_ANNUAL || '',
    PAYPAL_ONESHOT_PRICE_EUR_IMAGE: process.env.PAYPAL_ONESHOT_PRICE_EUR_IMAGE || process.env.PAYPAL_ONESHOT_PACK10_IMAGES_EUR || '0.99',
    PAYPAL_ONESHOT_PRICE_EUR_VIDEO: process.env.PAYPAL_ONESHOT_PRICE_EUR_VIDEO || process.env.PAYPAL_ONESHOT_PACK5_VIDEOS_EUR || '1.49',
    PAYPAL_ONESHOT_PRICE_EUR_LIFETIME: process.env.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME || '99.00',
    JUICYADS_SNIPPET_B64: process.env.JUICYADS_SNIPPET_B64 || '',
    EROADVERTISING_SNIPPET_B64: process.env.EROADVERTISING_SNIPPET_B64 || '',
  });
}
