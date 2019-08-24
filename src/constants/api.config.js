const BASE_URL = "http://localhost:5000/api/v0.1/";
const CMS_BASE_URL = "http://localhost:3000";
const PASSWORD_ENCODE_SECRET = "hanaspeak_secret";
export const GOOGLE_RE_CAPTCHA_SITE_KEY =
	"6LdiL3kUAAAAAIO5RoHYLgCCTyXyYwUfQ7VMxwVI";
export const apiConfigs = {
	BASE_API: `${BASE_URL}`,
	//   BASE_API: `${BASE_URL}/frontend_api/v1`,
	SOCKET_URL: BASE_URL,
	PASSWORD_ENCODE_SECRET: PASSWORD_ENCODE_SECRET,
	BASE_IMAGE_URL: BASE_URL,
	CMS_BASE_URL: CMS_BASE_URL,
};
