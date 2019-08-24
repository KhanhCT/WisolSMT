const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const factoryModel = require("../models/factory_model");
const results = [];
fs.createReadStream(path.join(__dirname, "../data/factories.csv"))
	.pipe(csv())
	.on("data", data => {
		factoryModel.insert(data);
	})
	.on("end", () => {
		console.log("Import successfully");
	});
