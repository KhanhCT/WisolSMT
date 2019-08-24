var { sequelize, Sequelize } = require("./db");
const cities = sequelize.define(
	"dt_allcode",
	{
		id: {
			type: Sequelize.INTEGER(11).UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: Sequelize.STRING(100),
			allowNull: false,
		},
		type: {
			type: Sequelize.STRING(100),
		},
		value: {
			type: Sequelize.STRING(100),
			allowNull: false,
		},
		is_active: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	},
	{
		tableName: "dt_allcode",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		charset: "utf8mb4",
		collate: "utf8mb4_unicode_ci",
		underscored: true,
	}
);
module.exports = cities;
