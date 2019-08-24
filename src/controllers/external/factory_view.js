"use strict";
var FactorYModel = require("../../models/factory_model");
var FactoryController = function() {};

FactoryController.New = function(data) {
	data.is_active = true;
	return FactorYModel.insert(data);
};

FactoryController.Update = function(ids, data) {
	return FactorYModel.update(ids, data, {});
};

FactoryController.FindAll = function(ids = [], limit = 1000, page = 1) {
	return FactorYModel.find((ids = ids), (limit = limit), (page = page));
};

module.exports = FactoryController;
