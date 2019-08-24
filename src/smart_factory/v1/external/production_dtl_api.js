"use strict";
var express = require("express"),
	router = express.Router(),
	productionDtlView = require("../../../controllers/external/production_dtl_view"),
	moment = require('moment'),
	CommonApi = require("../common_api");

router.post("/", (req, res) => {
	CommonApi.create(req, res, productionDtlView.New);
});
router.get("/", (req, res) => {
	CommonApi.get(req, res, [], 1000, 1, productionDtlView.FindAll);
});
router.get("/order-per-day", (req, res) => {
	CommonApi.get(req, res, [], 1000, 1, productionDtlView.GetLstOrderPerDate);
});
router.get("/order-not-finished/:line_id", (req, res) => {
	CommonApi.get(req, res, {'line_id': parseInt(req.params['line_id'])}, 1000, 1, productionDtlView.GetUnfinshedOrder);
});
router.put("/", (req, res) => {
	let body = req.body;
	//console.log(body)
	let working_date = moment(body['working_date'], 'YYYY-MM-DD', true).format("MM/DD/YYYY")
	let ids = {
		working_date: working_date,
		factory_id: parseInt(body["factory_id"]),
		line_id: parseInt(body["line_id"]),
		shift_id: parseInt(body["shift_id"]),
		id: parseInt(body["id"]),
	};
	console.log(ids)
	CommonApi.update(req, res, ids, productionDtlView.Update);
});
module.exports = router;
