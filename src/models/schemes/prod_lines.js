var { sequelize, Sequelize } = require("./db");
const ProdLine = sequelize.define(
	"sf_prod_lines",
	{
		id: {
			type: Sequelize.INTEGER(11).UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		factory_id: {
			type: Sequelize.INTEGER(11).UNSIGNED,
			allowNull: false,
			references: {
				model: "sf_factories",
				key: "id",
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
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
		tableName: "sf_prod_lines",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		charset: "utf8mb4",
		collate: "utf8mb4_unicode_ci",
		underscored: true,
	}
);
module.exports = ProdLine;
