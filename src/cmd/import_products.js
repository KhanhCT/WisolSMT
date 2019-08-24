const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const productModel = require("../models/product_model");
const results = [];
fs.createReadStream(path.join(__dirname, "../data/products.csv"))
	.pipe(csv())
	.on("data", data => {
		productModel.insert(data);
	})
	.on("end", () => {
		console.log("Import successfully");
	});
