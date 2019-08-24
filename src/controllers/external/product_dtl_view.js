"use strict";
var ProductDtlModel = require("../../models/product_dtl_model");
var ProductDtlController = function() {};

ProductDtlController.New = function(data) {
	data.is_active = true;
	return ProductDtlModel.insert(data);
};

ProductDtlController.Update = function(ids, data) {
	return ProductDtlModel.update(ids, data, {});
};

ProductDtlController.GetProdLstPerDay = function(ids, limit, page) {
	return ProductDtlModel.getProdLstPerDay(ids=ids, limit=limit, page=page);
};

module.exports = ProductDtlController;
