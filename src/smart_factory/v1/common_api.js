class CommonApi {
	constructor() {}
	static create(req, res, controllerFunc) {
		controllerFunc(req.body)
			.then(newResource => {
				return res.status(200).jsend.success(newResource);
			})
			.catch(error => {
				console.log(error);
				return res.status(error["code"]).jsend.error({
					code: error["code"],
					message: error["message"],
				});
			});
	}

	static get(req, res, ids, limit, page, controllerFunc) {
		controllerFunc(ids, limit, page)
			.then(results => {
				return res.status(200).jsend.success(results);
			})
			.catch(error => {
				return res.status(error["code"]).jsend.error({
					code: error["code"],
					message: error["message"],
				});
			});
	}
	static update(req, res, ids, controllerFunc) {
		controllerFunc(ids, req.body)
			.then(result => {
				return res.status(200).jsend.success(result);
			})
			.catch(error => {
				return res.status(error["code"]).jsend.error({
					code: error["code"],
					message: error["message"],
				});
			});
	}
	static delete(req, res, id, controllerFunc) {
		controllerFunc(id)
			.then(result => {
				return res.status(200).jsend.success(result);
			})
			.catch(error => {
				return res.status(error["code"]).jsend.error({
					code: error["code"],
					message: error["message"],
				});
			});
	}
}

module.exports = CommonApi;
