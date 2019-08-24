"use strict";

var db = require("./schemes");
var fs = require("fs");
var BaseCRUD = require("./base_crud");
var CRUD = new BaseCRUD(db.ProductDtl);
var logger = require("../utils/logger");
var ProductDtlModel = function() {};

ProductDtlModel.insert = data => CRUD.create(data);
ProductDtlModel.update = (ids, data, queryOptions) =>
	CRUD.update(ids, data, queryOptions);
ProductDtlModel.disable = ids => CRUD.update(ids, { is_active: false });
ProductDtlModel.find = (
	ids,
	limit,
	page,
	attributes = null,
	orders = null,
	queryOptions = {}
) => CRUD.get(ids, limit, page, attributes, orders, queryOptions);
ProductDtlModel.getProdLstPerDay = function(ids,
	limit=1000,
	page=1,
	attributes = null,
	orders = null,
	queryOptions = {}) {
		let working_date = ids['working_date']
		return new Promise((resolve, reject) => {
			db.sequelize.query('select t1.*, t2.name as product_name from sf_product_dtl as t1 inner join sf_products as t2 on t1.product_id=t2.id where t1.working_date = :working_date', {replacements: {working_date: working_date}, type: db.sequelize.QueryTypes.SELECT})
				.then(result => {
					if (result["count"] == 0)
						return reject({
							code: 404,
							message: "Not found any product dtl",
						});
					// console.log(typeof(result))
					// for(let product in result){
					// 	console.log("1111111")
					// 	console.log(product)
					// 	if(product.remain_qty > 24){

					// 		product.status= "AVAILABLE";
					// 		product.color = "DCD800";
					// 	} else {
					// 		product.status = "WAITING";
					// 		product.color = "8E1E20";
					// 	}
					// }
					return resolve(result);
				})
				.catch(error => {
					console.log(error)
					return reject({
						code: 500,
						message: "Failed to get list product dtl",
					});
				});
		});
	};
module.exports = ProductDtlModel;