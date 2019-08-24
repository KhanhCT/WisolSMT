"use strict";

var db = require("./schemes");
var fs = require("fs");
var BaseCRUD = require("./base_crud");
var CRUD = new BaseCRUD(db.Shift);
var logger = require("../utils/logger");
var ShiftModel = function() {};

ShiftModel.insert = data => CRUD.create(data);
ShiftModel.update = (ids, data, queryOptions) =>
	CRUD.update(ids, data, queryOptions);
ShiftModel.disable = ids => CRUD.update(ids, { is_active: false });
ShiftModel.find = (
	ids,
	limit,
	page,
	attributes = null,
	orders = null,
	queryOptions = {}
) => CRUD.get(ids, limit, page, attributes, orders, queryOptions);

ShiftModel.findByFactory = function(factory_id) {
	return new Promise((resolve, reject) => {
		db.Shift.findAndCount({
			where: {
				factory_id: factory_id,
				is_active: true,
			},
		})
			.then(result => {
				if (result["count"] == 0)
					return reject({
						code: 404,
						message: "Not found any shift",
					});
				return resolve(result);
			})
			.catch(error => {
				logger.error("[Get list of prod shifts]: ", error);
				return reject({
					code: 500,
					message: "Failed to get list of prod shifts",
				});
			});
	});
};
module.exports = ShiftModel;
