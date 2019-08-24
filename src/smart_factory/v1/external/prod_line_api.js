"use strict";
var express = require("express"),
	router = express.Router(),
	prodLineView = require("../../../controllers/external/prod_line_view"),
	CommonApi = require("../common_api");

router.post("/", (req, res) => {
	CommonApi.create(req, res, prodLineView.New);
});
router.get("/:factory_id", (req, res) => {
	let factory_id = parseInt(req.params["factory_id"]);
	CommonApi.get(req, res, factory_id, 1000, 1, prodLineView.FindByFactory);
});
router.put("/:id", (req, res) => {
	let id = parseInt(req.params["id"]);
	CommonApi.update(req, res, { id: id }, prodLineView.Update);
});
router.delete("/:id", (req, res) => {
	let id = parseInt(req.params["id"]);
	req.body['is_active'] = false
	CommonApi.update(req, res, { id: id }, prodLineView.Update);
});
module.exports = router;
