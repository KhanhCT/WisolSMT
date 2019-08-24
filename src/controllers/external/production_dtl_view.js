"use strict";
var ProductionDtlModel = require("../../models/production_dtl_model");
var ProductionDtlController = function() {};

ProductionDtlController.New = function(data) {
	data.is_active = false;
	return ProductionDtlModel.insert(data);
};

ProductionDtlController.Update = function(ids, data) {
	return ProductionDtlModel.update(ids, data, {});
};

ProductionDtlController.FindAll = function(
	ids,
	limit,
	page,
	attributes = null,
	orders = null,
	queryOptions = {}
) {
	return ProductionDtlModel.find(
		ids,
		limit,
		page,
		attributes,
		orders,
		queryOptions
	);
};

ProductionDtlController.GetLstOrderPerDate = function(ids, limit, page) {
	return ProductionDtlModel.getLstOrderPerDate();
};
ProductionDtlController.GetUnfinshedOrder = function(ids, limit, page) {
	return ProductionDtlModel.getUnfinshedOrder(ids['line_id']);
};
module.exports = ProductionDtlController;
