import moment from 'moment';
export function createPlan(req,res){
    let userId = req.session.userId;
    if(userId == null){
        res.status(401).send('Unauthorized ')
        return;
    }

    let params = Object.assign({}, req.body);
    let date = moment(params.date, 'DD-MM-YYYY');
    if (!date) {
        res.json(false);
        console.log('Date fail');
        return;
    }
    let productionPlan = {
       WorkingDate : params.date,
       FactoryID : 1,
       LineID : params.lineId,
       ShiftID : params.shiftId,
       ProductID : params.productID, 
       OrderedQty : params.orderedQty,
       GoodProdQty : 0,
       RemainQty : params.orderedQty
    }

    var sql="INSERT INTO productionplan SET ?";
    db.query(sql,productionPlan, function(err, results){
        if (err) throw err;
        res.json(true);
    });       
 };

 export function updatePlan(req,res){
    let userId = req.session.userId;
    if(userId == null){
        res.status(401).send('Unauthorized ')
        return;
    }

    let params = Object.assign({}, req.body);
    let date = moment(params.date, 'DD-MM-YYYY');
    if (!date) {
        res.json(false);
        console.log('Date fail');
        return;
    }
    let updatePlanObj = {
       WorkingDate : params.date,
       FactoryID : 1,
       LineID : params.lineId,
       ShiftID : params.shiftId,
       GoodProdQty : params.goodProdQty
    }

    var sql = "UPDATE productionplan SET GoodProdQty = GoodProdQty + "+updatePlanObj.GoodProdQty +",RemainQty = RemainQty - "+updatePlanObj.GoodProdQty;
    var conditionSQL = " WHERE WorkingDate='"+updatePlanObj.WorkingDate+"' AND FactoryID ="+updatePlanObj.FactoryID+" AND LineID = "+updatePlanObj.LineID+" AND ShiftID = "+updatePlanObj.ShiftID+"";
    db.query(sql + conditionSQL, function(err, results){
        if (err) {
            res.json(false);
            throw err;
        }
        res.json(true);
    });       
 };

 export function getLstOrderNotFinish(req,res){
    let userId = req.session.userId;
    if(userId == null){
        res.status(401).send('Unauthorized ')
       return;
    }

    let data = {};
    let lineId = Number(req.params.lineId);
    if (lineId) {
        var sql="SELECT * FROM productiondtl WHERE LineID = "+lineId+" AND Finished = false";
        db.query(sql, function(err, results){
            if (err) throw err;
            data = {
                id : results[0].id,
                WorkingDate : results[0].WorkingDate,
                FactoryID : results[0].FactoryID,
                ShiftID : results[0].ShiftID,
                LineID : results[0].LineID,
                Amount : results[0].Amount,
                Finished : results[0].Finished
            }
            res.json(data)
            });  
    }
 };

 export const getLineResult = async (req,res) => {
    let userId = req.session.userId;
    // if(userId == null){
    //     res.status(401).send('Unauthorized ')
    //    return;
    // }
    let dateStr = req.params.date;
    let date = moment(dateStr, 'DD-MM-YYYY');
    if (!date) {
        res.json(null);
        console.log('Date fail');
        return;
    }
    const query = async (sql) => {
        return new Promise(resolve=>{
            db.query(sql, function(err, results){
                if (err) {
                    resolve(null)
                    throw err;
                } 
                resolve(JSON.parse(JSON.stringify(results)))
            });
        })
    }

    let lstLines = await query("SELECT * FROM productionline");
    let lstModel = await query("SELECT * FROM product");
    var result = [];
    if (lstLines) {
        for (let i = 0; i < lstLines.length; i++) {
            let dataLine = {};
            dataLine.lineId = lstLines[i].LineID;
            let countProd = await query("SELECT COUNT(*) AS amount FROM productiondtl WHERE WorkingDate = '"+dateStr+"' AND LineID = '"+lstLines[i].LineID+"' AND Finished = false");
            if (countProd[0].amount > 0) {
                dataLine.status = "ORDERING"
            } else {
                dataLine.status = "RUN"
            }
            let prodPlan = await query ("SELECT * FROM productionplan WHERE WorkingDate = '"+dateStr+"' AND LineID = '"+lstLines[i].LineID+"'");
            if (prodPlan) {
                if (prodPlan[0]) {
                    dataLine.order = prodPlan[0].OrderedQty;
                    dataLine.elapsed = prodPlan[0].GoodProdQty;
                    dataLine.remain = prodPlan[0].RemainQty;
                    for (let j = 0; j < lstModel.length; j++) {
                        if (lstModel[j].id == prodPlan[0].ProductID) {
                            dataLine.model = lstModel[j].product_name;
                        }
                    }
                } else {
                    dataLine.order = 0;
                    dataLine.elapsed = 0;
                    dataLine.remain = 0;
                }
                
            }
            result.push(dataLine);
        }
    }
    res.json(result);
}
