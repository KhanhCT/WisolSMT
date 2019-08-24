"use strict";

var db = require("./schemes");
var fs = require("fs");
var BaseCRUD = require("./base_crud");
var CRUD = new BaseCRUD(db.ProdLine);
var logger = require("../utils/logger");
var ProdLineModel = function() {};

ProdLineModel.insert = data => CRUD.create(data);
ProdLineModel.update = (ids, data, queryOptions) =>
	CRUD.update(ids, data, queryOptions);
ProdLineModel.disable = ids => CRUD.update(ids, { is_active: false });
ProdLineModel.find = (
	ids,
	limit,
	page,
	attributes = null,
	orders = null,
	queryOptions = {}
) => CRUD.get(ids, limit, page, attributes, orders, queryOptions);

ProdLineModel.findByFactory = function(factory_id) {
	return new Promise((resolve, reject) => {
		db.ProdLine.findAll({
			where: {
				factory_id: factory_id,
				is_active: true,
			},
		})
			.then(result => {
				if (result["count"] == 0)
					return reject({
						code: 404,
						message: "Not found any production line",
					});
				return resolve(result);
			})
			.catch(error => {
				logger.error("[Get list of prod lines]: ", error);
				return reject({
					code: 500,
					message: "Failed to get list of prod lines",
				});
			});
	});
};
module.exports = ProdLineModel;
