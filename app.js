#!/usr/bin/bash
var express = require("express");
// var path = require("path");
var app = express();
var morgan = require("morgan");
var config = require("config");

app.use(morgan("dev"));
app.use(express.static("build"));
app.set("view engine", "ejs");
app.set("views", "./views");

// Handle view production
app.get("/*", function(req, res) {
    res.header("Content-Type", "text/html");
    return res.render("index");
});

var port = process.env.PORT || config.get("server.port");

app.listen(port, () => {
    console.log("Server is running at port:" + port);
});
