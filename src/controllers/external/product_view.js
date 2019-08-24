"use strict";
var ProductModel = require("../../models/product_model");
var ProductController = function() {};

ProductController.New = function(data) {
	data.is_active = true;
	return ProductModel.insert(data);
};

ProductController.Update = function(ids, data) {
	return ProductModel.update(ids, data, {});
};

ProductController.FindAll = function(ids = [], limit = 1000, page = 1) {
	return ProductModel.find((ids = ids), (limit = limit), (page = page));
};

module.exports = ProductController;
