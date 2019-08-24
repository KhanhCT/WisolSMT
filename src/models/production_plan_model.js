"use strict";

var db = require("./schemes");
var fs = require("fs");
var BaseCRUD = require("./base_crud");
var CRUD = new BaseCRUD(db.ProductionPlan);
var logger = require("../utils/logger");
var ProductionPlanController = function() {};

ProductionPlanController.insert = data => CRUD.create(data);
ProductionPlanController.update = (ids, data, queryOptions) =>
	CRUD.update(ids, data, queryOptions);
ProductionPlanController.disable = ids =>
	CRUD.update(ids, { is_active: false });
ProductionPlanController.find = (
	ids,
	limit,
	page,
	attributes = null,
	orders = null,
	queryOptions = {}
) => CRUD.get(ids, limit, page, attributes, orders, queryOptions);

ProductionPlanController.getLineInfoPerDay = function(ids,
	limit,
	page,
	attributes = null,
	orders = null,
	queryOptions = {}) {
	let working_date = ids['working_date']
	return new Promise((resolve, reject) => {
		db.sequelize.query('select t1.*, t2.name as line_name, t3.name as product_name from sf_production_plan as t1 inner join sf_prod_lines as t2 on t1.line_id=t2.id and t1.factory_id=t2.factory_id inner join sf_products as t3 on t1.product_id=t3.id where working_date = :working_date order by t1.line_id, t1.product_id', {replacements: {working_date: working_date}, type: db.sequelize.QueryTypes.SELECT})
			.then(result => {
				if (result["count"] == 0)
					return reject({
						code: 404,
						message: "Not found any production plan",
					});
				return resolve(result);
			})
			.catch(error => {
				logger.error("[Get list of production plan]: ", error);
				return reject({
					code: 500,
					message: "Failed to get list of production plan",
				});
			});
	});
};
module.exports = ProductionPlanController;
