"use strict";
var express = require("express"),
	router = express.Router(),
	productDtlView = require("../../../controllers/external/product_dtl_view"),
	CommonApi = require("../common_api"),
	moment = require('moment');

router.post("/", (req, res) => {
	CommonApi.create(req, res, productDtlView.New);
});
router.get("/:working_date", (req, res) => {
	let working_date = req.params['working_date']
	let ids = {
		working_date: working_date,
	}
	CommonApi.get(req, res, ids, 1000, 1, productDtlView.GetProdLstPerDay);
});
router.put("/", (req, res) => {
	let body = req.body;
	let working_date = moment(body['working_date'], 'YYYY-MM-DD', true);
	let ids = {
		working_date: working_date,
		product_id: body['product_id']
	}
	CommonApi.update(
		req,
		res,
		ids,
		productDtlView.Update
	);
});
module.exports = router;
