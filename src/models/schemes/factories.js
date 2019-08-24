var { sequelize, Sequelize } = require("./db");
const Factory = sequelize.define(
	"sf_factories",
	{
		id: {
			type: Sequelize.INTEGER(11).UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: "Prod Line",
		},
		is_active: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	},
	{
		tableName: "sf_factories",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		charset: "utf8mb4",
		collate: "utf8mb4_unicode_ci",
		underscored: true,
	}
);
module.exports = Factory;
