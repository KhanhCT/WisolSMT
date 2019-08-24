var Sequelize = require("sequelize");
var config = require("config");
var baseTypes = require("sequelize/lib/data-types");
var util = require("util");
const sequelize = new Sequelize(
    config.get("postgres.database"),
    config.get("postgres.user"),
    config.get("postgres.password"),
    {
        host: config.get("postgres.host"),
        port: config.get("postgres.port"),
        dialect: "postgres",
        operatorsAliases: false,

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

// Custom TIMESTAMP
var TIMESTAMP = function() {
    if (!(this instanceof TIMESTAMP)) {
        return new TIMESTAMP();
    }
    baseTypes.ABSTRACT.apply(this, arguments);
};

util.inherits(TIMESTAMP, baseTypes.ABSTRACT);

TIMESTAMP.prototype.key = TIMESTAMP.key = "TIMESTAMP";

module.exports = { sequelize, Sequelize, TIMESTAMP };