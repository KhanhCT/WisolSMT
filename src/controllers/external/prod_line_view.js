"use strict";
var ProdLineModel = require("../../models/prod_line_model");
var ProdLineController = function() {};

ProdLineController.New = function(data) {
	data.is_active = true;
	return ProdLineModel.insert(data);
};

ProdLineController.Update = function(ids, data) {
	return ProdLineModel.update(ids, data, {});
};

ProdLineController.FindByFactory = function(ids = ids, limit, page) {
	return ProdLineModel.findByFactory((ids = ids));
};

module.exports = ProdLineController;
