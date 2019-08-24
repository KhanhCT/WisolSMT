var { sequelize, Sequelize } = require("./db");
const ProductDtl = sequelize.define(
	"sf_product_dtl",
	{
		working_date: {
			type: Sequelize.DATEONLY,
			primaryKey: true,
		},
		product_id: {
			type: Sequelize.INTEGER(11).UNSIGNED,
			primaryKey: true,
			references: {
				model: "sf_products",
				key: "id",
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
		exported_qty: {
			type: Sequelize.INTEGER(11).UNSIGNED,
			defaultValue: 0,
		},
		remain_qty: {
			type: Sequelize.INTEGER(11).UNSIGNED,
			defaultValue: 0,
		},
		is_active: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	},
	{
		tableName: "sf_product_dtl",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		charset: "utf8mb4",
		collate: "utf8mb4_unicode_ci",
		underscored: true,
	}
);
module.exports = ProductDtl;
