"use strict";

var db = require("./schemes");
var fs = require("fs");
var moment = require("moment")
var BaseCRUD = require("./base_crud");
var CRUD = new BaseCRUD(db.ProductionDtl);
var logger = require("../utils/logger")
var { sequelize, Sequelize } = require("./schemes/db");
var ProductionDtlModel = function() {};

ProductionDtlModel.insert = data => CRUD.create(data);
ProductionDtlModel.update = (ids, data, queryOptions) =>
	CRUD.update(ids, data, queryOptions);
ProductionDtlModel.disable = ids => CRUD.update(ids, { is_active: false });
ProductionDtlModel.find = (
	ids,
	limit,
	page,
	attributes = null,
	orders = null,
	queryOptions = {}
) => CRUD.get(ids, limit, page, attributes, orders, queryOptions);

ProductionDtlModel.getLstOrderPerDate = function() {
	let working_date = moment(new Date()).format('YYYY-MM-DD')
	console.log(working_date)
	return new Promise((resolve, reject) => {
		db.sequelize.query('select t1.*, t2.name as product_name, t3.name as line_name from sf_production_dtl as t1 inner join sf_products as t2 on t1.product_id=t2.id inner join sf_prod_lines as t3 on t1.factory_id=t3.factory_id and t1.line_id=t3.id where t1.working_date = :working_date and t1.finished=false', {replacements: {working_date: working_date}, type: db.sequelize.QueryTypes.SELECT})
			.then(result => {
				if (result["count"] == 0)
					return reject({
						code: 404,
						message: "Not found any production dtl",
					});
				return resolve(result);
			})
			.catch(error => {
				logger.error("[Get list of production dtl]: ", error);
				return reject({
					code: 500,
					message: "Failed to get list of production dtl",
				});
			});
	});
};

ProductionDtlModel.getUnfinshedOrder = function(line_id) {
	return new Promise((resolve, reject) => {
		db.ProductionDtl.findAll({
			where: {
				line_id: line_id,
				finished: false,
			},
		}).then(result => {
			if (result["count"] == 0)
				return reject({
					code: 404,
					message: "Not found any production dtl",
				});
			return resolve(result);
		})
		.catch(error => {
			logger.error("[Get list of prod dtl]: ", error);
			return reject({
				code: 500,
				message: "Failed to get list of prod dtl",
			});
		});
	});
}

module.exports = ProductionDtlModel;
