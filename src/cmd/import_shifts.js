const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const shiftModel = require("../models/shift_model");
const results = [];
fs.createReadStream(path.join(__dirname, "../data/shifts.csv"))
	.pipe(csv())
	.on("data", data => {
		shiftModel.insert(data);
	})
	.on("end", () => {
		console.log("Import successfully");
	});
