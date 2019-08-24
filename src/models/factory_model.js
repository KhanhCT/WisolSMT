"use strict";

var db = require("./schemes");
var fs = require("fs");
var BaseCRUD = require("./base_crud");
var CRUD = new BaseCRUD(db.Factory);
var logger = require("../utils/logger");
var FactoryModel = function() {};

FactoryModel.insert = data => CRUD.create(data);
FactoryModel.update = (ids, data, queryOptions) =>
	CRUD.update(ids, data, queryOptions);
FactoryModel.disable = ids => CRUD(ids, { is_active: false });
FactoryModel.find = (
	ids,
	limit,
	page,
	attributes = null,
	orders = null,
	queryOptions = {}
) => CRUD.get(ids, limit, page, attributes, orders, queryOptions);
module.exports = FactoryModel;
