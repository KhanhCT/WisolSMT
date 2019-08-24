"use strict";
var express = require("express"),
	router = express.Router(),
	moment = require('moment'),
	productionPlanView = require("../../../controllers/external/production_plan_view"),
	CommonApi = require("../common_api");

router.post("/", (req, res) => {
	CommonApi.create(req, res, productionPlanView.New);
});
router.get("/:factory_id/:line_id", (req, res) => {
	let ids = {
		factory_id: req.params['factory_id'],
		line_id: req.params['line_id']
	}
	CommonApi.get(req, res, ids, 1000, 1, productionPlanView.FindAll);
});
router.get("/:working_date", (req, res) => {
	let ids = {
		working_date: req.params['working_date']
	}
	CommonApi.get(req, res, ids, 1000, 1, productionPlanView.GetLineInfoPerDay);
});
// router.get("/line-info/:working_date", (req, res) => {
// 	let ids = {
// 		working_date: req.params['working_date'],
// 	}
// 	CommonApi.get(req, res, ids, 1000, 1, productionPlanView.GetLineInfoPerDay);
// });
router.put("/", (req, res) => {
	let body = req.body;
	let ids = {
		working_date:  moment(body['working_date'], 'YYYY-MM-DD', true).format("MM/DD/YYYY"),
		factory_id: parseInt(body["factory_id"]),
		line_id: parseInt(body["line_id"]),
		shift_id: parseInt(body["shift_id"]),
		product_id: parseInt(body["product_id"]),
	};
	CommonApi.update(req, res, ids, productionPlanView.Update);
});
module.exports = router;
