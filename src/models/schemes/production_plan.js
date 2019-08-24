var { sequelize, Sequelize } = require("./db");
const ProductionPlan = sequelize.define(
	"sf_production_plan",
	{
		working_date: {
			type: Sequelize.DATEONLY,
			primaryKey: true,
		},
		factory_id: {
			type: Sequelize.INTEGER(11).UNSIGNED,
			primaryKey: true,
			references: {
				model: "sf_factories",
				key: "id",
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
		shift_id: {
			type: Sequelize.INTEGER(11).UNSIGNED,
			primaryKey: true,
			references: {
				model: "sf_shift",
				key: "id",
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
		line_id: {
			type: Sequelize.INTEGER(11).UNSIGNED,
			primaryKey: true,
			references: {
				model: "sf_prod_lines",
				key: "id",
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
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
		ordered_qty: {
			type: Sequelize.INTEGER(11).UNSIGNED,
			defaultValue: 0,
		},
		good_prod_qty: {
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
		tableName: "sf_production_plan",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		charset: "utf8mb4",
		collate: "utf8mb4_unicode_ci",
		underscored: true,
	}
);
module.exports = ProductionPlan;
