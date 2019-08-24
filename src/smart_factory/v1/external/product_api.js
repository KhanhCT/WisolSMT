"use strict";
var express = require("express"),
	router = express.Router(),
	productView = require("../../../controllers/external/product_view"),
	CommonApi = require("../common_api");

router.post("/", (req, res) => {
	CommonApi.create(req, res, productView.New);
});
router.get("/", (req, res) => {
	CommonApi.get(req, res, [], 1000, 1, productView.FindAll);
});
router.put("/:id", (req, res) => {
	let id = parseInt(req.params["id"]);
	CommonApi.update(req, res, { id: id }, productView.Update);
});
router.delete("/:id", (req, res) => {
	let id = parseInt(req.params["id"]);
	req.body['is_active'] = false
	CommonApi.update(req, res, { id: id }, productView.Update);
});
module.exports = router;
