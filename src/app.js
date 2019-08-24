// ======================= get the packages we need ============
// =======================
var express = require("express");
var app = express();
// Combine API with socketIO server
var server = require("http").createServer(app);
// var io = require("socket.io")(server);
// var socketioJwt = require("socketio-jwt");
var bodyParser = require("body-parser");
var morgan = require("morgan");
// var mongoose = require("mongoose");
var config = require("config");
// var jwt = require("jsonwebtoken");
var jsend = require("jsend");
// var swaggerUi = require("swagger-ui-express");
var bearerToken = require("express-bearer-token");
var cors = require("cors");
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
//user bearer token
app.use(
	bearerToken({
		bodyKey: "access_token",
		queryKey: "access_token",
		headerKey: "Bearer",
		reqKey: "token",
	})
);

// Using jsend middle ware
app.use(jsend.middleware);

// use morgan to log requests to the console
app.use(morgan("dev"));

// Import API router
var apiRoutes = require("./");
app.use(apiRoutes);

// Handle view production
app.get("/*", function(req, res) {
	res.header("Content-Type", "text/html");
	return res.render("index");
});

var port = process.env.PORT || config.get("server.port");
server.listen(port, () => {
	console.log("Server is running at port:" + port);
});
