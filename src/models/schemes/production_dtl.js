var { sequelize, Sequelize } = require("./db");
var db = require("./")
const ProductionDtl = sequelize.define(
	"sf_production_dtl",
	{
		id: {
			type: Sequelize.INTEGER(11).UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		working_date: {
			type: Sequelize.DATEONLY,
			allowNull: false,
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
		amount: {
			type: Sequelize.INTEGER(11).UNSIGNED,
			defaultValue: 0,
		},
		duaration: {
			type: Sequelize.INTEGER.UNSIGNED,
			defaultValue: 0,
		},
		start_time: {
			type: Sequelize.DATE,
			allowNull: true,
		},
		stop_time: {
			type: Sequelize.DATE,
			allowNull: true,
		},
		message: {
			type: Sequelize.STRING,
			allowNull: 'WAITING',
		},
		finished: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	},
	{
		tableName: "sf_production_dtl",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		charset: "utf8mb4",
		collate: "utf8mb4_unicode_ci",
		underscored: true,
	}
);
//ProductionDtl.hasOne(db.Product)
module.exports = ProductionDtl;
