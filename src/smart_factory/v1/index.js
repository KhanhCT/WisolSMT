"use strict";

var express = require("express"),
	router = express.Router(),
	factory_api = require("./external/factory_api"),
	prod_line_api = require("./external/prod_line_api"),
	shift_api = require("./external/shift_api"),
	product_api = require("./external/product_api"),
	product_dtl_api = require("./external/product_dtl_api"),
	production_plan_api = require("./external/production_plan_api"),
	production_dtl_api = require("./external/production_dtl_api");

router.use("/factory", factory_api);
router.use("/prod-line", prod_line_api);
router.use("/shift", shift_api);
router.use("/product", product_api);
router.use("/product-dtl", product_dtl_api);
router.use("/production-plan", production_plan_api);
router.use("/production-dtl", production_dtl_api);
module.exports = router;
