// auto-generated 20250831_215220
export const IBG_ENV = {
  IBG_ASSETS_BASE_URL: "https://ibizagirl-assets.s3.eu-north-1.amazonaws.com",
  EROADVERTISING_ZONE: "8177575",
  EXOCLICK_ZONE:       "5696328",
  JUICYADS_ZONE:       "1099637",
  JUICYADS_SNIPPET_B64:"2093981",
  POPADS_SITE_ID:      "e494ffb82839a29122608e933394c091",
  POPADS_ENABLE:       "true",
  CRISP_WEBSITE_ID:    "59e184b1-e679-4c93-b3ea-d60b63c1c04c"
};
// también en window para scripts no-ESM
if (typeof window !== "undefined") {
  window.IBG_ENV = IBG_ENV;
  for (var k in IBG_ENV) { try { window[k] = IBG_ENV[k]; } catch(_){ } }
}
export default IBG_ENV;
