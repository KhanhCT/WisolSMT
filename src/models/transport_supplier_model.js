"use strict";

var db = require("./schemes");
var fs = require("fs");
var BaseCRUD = require("./base_crud");
var CRUD = new BaseCRUD(db.TransportSupplier);
var logger = require("../utils/logger");
var TransportSupplierModel = function() {};

TransportSupplierModel.insert = data => CRUD.create(data);
TransportSupplierModel.update = (ids, data, queryOptions) =>
	CRUD.update(ids, data, queryOptions);
TransportSupplierModel.disable = ids => CRUD(ids, { is_active: false });
TransportSupplierModel.find = (
	ids,
	limit,
	page,
	attributes = null,
	orders = null,
	queryOptions = {}
) => CRUD.get(ids, limit, page, attributes, orders, queryOptions);
module.exports = TransportSupplierModel;
