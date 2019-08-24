const CronJob = require("cron").CronJob;
var moment = require('moment');
var ProductionPlanModel = require("./models/production_plan_model");

const job1 = new CronJob("00 00 00 * * *", function() {
	var d = new Date();
	let nextWorkingDate = moment(d).format('MM/DD/YYYY')
	d.setDate(d.getDate -1);
	let workingDate = moment(d).format('MM/DD/YYYY')
	let planList = ProductionPlanModel.find(ids={}, limit=100, page=1, queryOptions={'is_active':true, 'working_date': workingDate});
	for(plan in planList){
		plan['is_active'] = false
		let nextOrderedQty = plan['remain_qty']
		let ids = {
			workingDate: workingDate,
			factory_id: plan['factory_id'],
			line_id: plan['line_id'],
			shift_id: plan['shift_id'],
			product_id: plan['factory_id'],
		}
		ProductionPlanModel.update(ids, data, {})
		plan['is_active'] = true
		plan['ordered_qty'] = nextOrderedQty
		plan['good_prod_qty'] = 0
		plan['remain_qty'] = 0
		plan['working_date'] = nextWorkingDate
		ProductionPlanModel.insert(data)
	}
});
const job2 = new CronJob("*/8 * * * * *", function() {
	const d = new Date();
});
console.log("Starting job instances.........");
job1.start();
//job2.start();
