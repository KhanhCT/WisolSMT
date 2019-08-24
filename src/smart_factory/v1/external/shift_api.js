"use strict";
var express = require("express"),
	router = express.Router(),
	shiftView = require("../../../controllers/external/shift_view"),
	CommonApi = require("../common_api");

router.post("/", (req, res) => {
	CommonApi.create(req, res, shiftView.New);
});
router.get("/:factory_id", (req, res) => {
	let factory_id = parseInt(req.params["factory_id"]);
	let ids = {
		'factory_id': factory_id
	}
	CommonApi.get(req, res, ids, 1000, 1, shiftView.FindByFactory);
});
router.put("/:id", (req, res) => {
	let id = parseInt(req.params["id"]);
	CommonApi.update(req, res, { id: id }, shiftView.Update);
});
module.exports = router;
