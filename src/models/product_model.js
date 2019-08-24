"use strict";

var db = require("./schemes");
var fs = require("fs");
var BaseCRUD = require("./base_crud");
var CRUD = new BaseCRUD(db.Product);
var logger = require("../utils/logger");
var ProductModel = function() {};

ProductModel.insert = data => CRUD.create(data);
ProductModel.update = (ids, data, queryOptions) =>
	CRUD.update(ids, data, queryOptions);
ProductModel.disable = ids => CRUD.update(ids, { is_active: false });
ProductModel.find = (
	ids,
	limit,
	page,
	attributes = null,
	orders = ['id',],
	queryOptions={'is_active': true}
) => CRUD.get(ids, limit, page, attributes, orders, queryOptions);
module.exports = ProductModel;
