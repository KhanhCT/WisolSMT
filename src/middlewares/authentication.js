"use strict";

var jwt = require("jsonwebtoken");
//http_client = require('../utils/http_client')

function check_authen(req, res, next) {
	// route middleware to verify a token
	// check header or url parameters or post parameters for token
	var token =
		req.body["access_token"] ||
		req.query["Author"] ||
		req.token ||
		req.headers.authorization;
	next();
	// verify token
	// let headers = {
	//     headers: {'Authorization': req.headers.authorization}
	// }
	// if (token) {
	//     http_client.get("/api-token-info", headers, {
	//         params: {}
	//     },
	//     ).then(function(resp){
	//         next();
	//     }).catch((err) => {
	//         console.log(err)
	//         return res.status(401).jsend.error({ code: 400, message: 'Token expired.' });
	//     })
	// } else {
	//     return res.status(401).jsend.error({ code: 401, message: 'No token provided.' });
	// }
}

module.exports = check_authen;
