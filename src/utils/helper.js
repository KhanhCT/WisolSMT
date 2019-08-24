var bcrypt = require("bcrypt");
var config = require("config");
var axios = require("axios");
var { HmacSHA512 } = require("crypto-js");
const PASSWORD_ENCODE_SECRET = "deeptravel_secret";
const helper = {};

helper.processRequestQuery = function(req) {
	let reqQuery = req.query;
	let limit = reqQuery["limit"],
		page = reqQuery["page"];
	try {
		limit = parseInt(limit);
		page = parseInt(page);
		if (!limit || limit <= 0) limit = 10;
		if (!page || page <= 1) page = 1;
	} catch (ex) {
		limit = 10;
		page = 1;
	}
	let offset = (page - 1) * limit;
	reqQuery["limit"] = limit;
	reqQuery["offset"] = offset;
	delete reqQuery["page"];
	return reqQuery;
};

helper.hashPassword = function(password) {
	return bcrypt.hashSync(password, config.get("salt_factor"));
};

helper.compare = function(plaintextPassword, hashPassword) {
	return bcrypt.compareSync(plaintextPassword, hashPassword);
};

helper.hasPasswordSHA = function(password) {
	let hashPw = HmacSHA512(password, PASSWORD_ENCODE_SECRET);
	return hashPw.toString();
};

helper.resetPasswordTemplate = function(password) {
	return `<p>You just requested a password reset, your new password is
    : <strong>${password}</strong></p>
    <p>Please change your password after login to ensure security!</p>
    <p>Thanks from Hanaspeak Team!</p>`;
};

helper.signUpTemplate = function(token) {
	return `<p>Thank you for signing up for an account, Please visit the link below to activate your account</p>
    <a href="https://lingo.page/validate_register?register_token=${token}">REGISTER VALIDATE URL</a>
    <p>Note: The link is only available for 24 hours!</p>
    <p>Thanks from Hanaspeak Team!</p>`;
};

helper.createTeacherTemplate = function(username) {
	return `<p>Thank you for signing up for an account teacher</p>
    <p>Your account is: <strong>${username}</strong></p>
    <p>Your password is: <strong>123456789</strong></p>
    <p>Please change your password after login to ensure security!</p>
    <p>Thanks from Hanaspeak Team!</p>`;
};

helper.createManagerTemplate = function(email) {
	return `<p>Thank you for signing up for an account manager</p>
    <p>Your account is: <strong>${email}</strong></p>
    <p>Your password is: <strong>123456789</strong></p>
    <p>Please change your password after login to ensure security!</p>
    <p>Thanks from Hanaspeak Team!</p>`;
};

helper.getWeatherForecast = async (lat, lon) => {
	let url = `${config.get(
		"weather_api.url"
	)}/forecast?lat=${lat}&lon=${lon}$aapid=${config.get(
		"weather_api.aapi_key"
	)}`;
	try {
		return await axios.get(url);
	} catch (error) {}
};
helper.getRoutes = async (origin = {}, destination = {}) => {
	let url = `${config.get("route_api.url")}_/direction/json?origin=${
		origin["lat"]
	},${origin["lon"]}&destination=${destination["lat"]}, ${
		destination["lon"]
	}$key=${config.get("route_api.aapi_key")}`;
	try {
		return await axios.get(url);
	} catch (error) {}
};

module.exports = helper;
