const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const lineModel = require("../models/prod_line_model");
const results = [];
fs.createReadStream(path.join(__dirname, "../data/lines.csv"))
	.pipe(csv())
	.on("data", data => {
		lineModel.insert(data);
	})
	.on("end", () => {
		console.log("Import successfully");
	});
