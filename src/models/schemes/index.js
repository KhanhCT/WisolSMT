const db = {};

var { sequelize, Sequelize, TIMESTAMP } = require("./db");
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Factory = require("./factories");
db.ProdLine = require("./prod_lines");
db.Shift = require("./shift");
db.Product = require("./product");
db.ProductDtl = require("./product_dtl");
db.ProductionDtl = require("./production_dtl");
db.ProductionPlan = require("./production_plan");
if (process.env.MIGRATE_ENV === "true") {
	console.log("Migrating database....");
	db.sequelize
		.sync({ force: true })
		.then(result => {
			console.log("Done!!!!!!");
			process.exit();
		})
		.catch(err => {
			console.log(err);
		});
	process.env.MIGRATE_ENV = false;
}
module.exports = db;
