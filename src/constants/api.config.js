const BASE_URL = "http://192.168.0.104:8090";
// const BASE_URL = "https://cms.hanaspeak.com";
const CMS_BASE_URL = "http://192.168.0.104:3000";
// const CMS_BASE_URL = "https://cms.hanaspeak.com";
const PASSWORD_ENCODE_SECRET = "hanaspeak_secret";
export const GOOGLE_RE_CAPTCHA_SITE_KEY =
  "6LdiL3kUAAAAAIO5RoHYLgCCTyXyYwUfQ7VMxwVI";
export const apiConfigs = {
  BASE_API: `${BASE_URL}/api/v0.1`,
  //   BASE_API: `${BASE_URL}/frontend_api/v1`,
  SOCKET_URL: BASE_URL,
  PASSWORD_ENCODE_SECRET: PASSWORD_ENCODE_SECRET,
  BASE_IMAGE_URL: BASE_URL,
  CMS_BASE_URL: CMS_BASE_URL,
};
