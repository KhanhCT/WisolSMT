"use strict";
var ShiftModel = require("../../models/shift_model");
var ShiftController = function() {};

ShiftController.New = function(data) {
	data.is_active = true;
	return ShiftModel.insert(data);
};

ShiftController.Update = function(ids, data) {
	return ShiftModel.update(ids, data, {});
};

ShiftController.FindByFactory = function(ids = ids, limit = 1000, page = 1) {
	return ShiftModel.findByFactory(ids['factory_id']);
};

module.exports = ShiftController;
