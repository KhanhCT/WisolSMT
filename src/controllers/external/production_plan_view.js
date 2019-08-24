"use strict";
var ProductionPlanModel = require("../../models/production_plan_model");
var ProductionPlanController = function() {};

ProductionPlanController.New = function(data) {
	data.is_active = true;
	return ProductionPlanModel.insert(data);
};

ProductionPlanController.Update = function(ids, data) {
	return ProductionPlanModel.update(ids, data, {});
};

ProductionPlanController.FindAll = function(
	ids,
	limit,
	page,
	attributes = null,
	orders = null,
	queryOptions = {'is_active':true}
) {
	return ProductionPlanModel.find(
		ids,
		limit,
		page,
		attributes,
		orders,
		queryOptions
	);
};

ProductionPlanController.GetLineInfoPerDay = function(
	ids,
	limit,
	page,
	attributes = null,
	orders = null,
	queryOptions = {}
) {
	return ProductionPlanModel.getLineInfoPerDay(ids,
		limit,
		page,
		attributes,
		orders,
		queryOptions
	);
}

module.exports = ProductionPlanController;
