"use strict";

var logger = require("../utils/logger");
class BaseCRUD {
	constructor(schema) {
		this.schema = schema;
		this.modelName = "";
	}

	create(data, keyFinds = []) {
		console.log(data);
		let self = this;
		return new Promise((resolve, reject) => {
			let whereObj = {};
			if (keyFinds.length > 0) {
				for (var key of keyFinds) {
					whereObj[key] = data[key];
				}
				self.schema
					.findCreateFind({ defaults: data, where: whereObj })
					.spread((modelInstance, created) => {
						if (created) return resolve(modelInstance);
						else
							return reject({
								code: 409,
								message: `Conflict! ${
									self.modelName
								} has existed`,
							});
					})
					.catch(error => {
						// logger.error(
						// 	`Create ${self.modelName} has error: `,
						// 	error
						// );
						return reject({
							code: 500,
							message: `Create new ${self.modelName} error`,
						});
					});
			} else
				self.schema
					.create(data)
					.then(result => {
						return resolve(result);
					})
					.catch(error => {
						// logger.error(
						// 	`Create ${self.modelName} has error: `,
						// 	error
						// );
						return reject({
							code: 500,
							message: `Create new ${self.modelName} error`,
						});
					});
		});
	}

	get(ids, limit, page, attributes = null, order = null, queryOptions = {}) {
		let self = this;
		return new Promise((resolve, reject) => {
			let offset = (page - 1) * limit;
			let whereObj = {};
			if (ids) {
				for (var key in ids) {
					whereObj[key] = ids[key];
				}
			}

			for (let key in queryOptions) whereObj[key] = queryOptions[key];
			let findObj = {
				where: whereObj,
				offset: offset,
				limit: limit,
			};
			if (attributes) findObj["attributes"] = attributes;
			if (order) findObj["order"] = order;
			self.schema
				.findAll(findObj)
				.then(result => {
					return resolve(result);
				})
				.catch(error => {
					logger.error(`Get ${self.modelName} has error: `, error);
					return reject({
						code: 500,
						message: `Get ${self.modelName} has error`,
					});
				});
		});
	}

	update(ids, data, queryOptions = {}) {
		let self = this;
		return new Promise((resolve, reject) => {
			let whereObj = {};
			if (ids) {
				for (var key in ids) {
					whereObj[key] = ids[key];
				}
			}
			for (let key in queryOptions) whereObj[key] = queryOptions[key];
			self.schema
				.update(data, {
					where: whereObj,
				})
				.then(result => {
					console.log(result);
					if (result[0] == 1)
						return resolve(`Update ${self.modelName} successfully`);
					else
						return reject({
							code: 404,
							message: "id is not existed",
						});
				})
				.catch(error => {
					logger.error(`Update ${self.modelName} has error: `, error);
					return reject({
						code: 500,
						message: `Update ${self.modelName} has error`,
					});
				});
		});
	}

	delete(ids, queryOptions = {}) {
		let self = this;
		return new Promise((resolve, reject) => {
			let whereObj = {};
			if (ids.length > 0) {
				for (var key in ids) {
					whereObj[key] = ids[key];
				}
			} else {
				return reject({ code: 404, message: "id not found" });
			}
			for (let key in queryOptions) whereObj[key] = queryOptions[key];
			self.schema
				.destroy({
					where: whereObj,
				})
				.then(result => {
					if (result == 1)
						return resolve(`Delete ${self.modelName} successfully`);
					else return reject({ code: 404, message: "id not found" });
				})
				.catch(error => {
					logger.error(`Delete ${self.modelName} has error: `, error);
					return reject({
						code: 500,
						message: `Delete ${self.modelName} error`,
					});
				});
		});
	}
}

module.exports = BaseCRUD;
