"use strict";
var express = require("express"),
	router = express.Router(),
	check_authen = require("../../../middlewares/authentication"),
	factoryView = require("../../../controllers/external/factory_view"),
	CommonApi = require("../common_api");
router.use(check_authen);
router.post("/", (req, res) => {
	CommonApi.create(req, res, factoryView.New);
});
router.get("/", (req, res) => {
	CommonApi.get(req, res, [], 1000, 1, factoryView.FindAll);
});
router.put("/:id", (req, res) => {
	let id = parseInt(req.params["id"]);
	CommonApi.update(req, res, { id: id }, factoryView.Update);
});
module.exports = router;
