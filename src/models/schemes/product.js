var { sequelize, Sequelize } = require("./db");
const Product = sequelize.define(
	"sf_products",
	{
		id: {
			type: Sequelize.INTEGER(11).UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		barcode: {
			type: Sequelize.CHAR((length = 12)),
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: "P1",
		},
		is_active: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	},
	{
		tableName: "sf_products",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		charset: "utf8mb4",
		collate: "utf8mb4_unicode_ci",
		underscored: true,
	}
);
module.exports = Product;
