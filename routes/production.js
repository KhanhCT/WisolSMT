import moment from 'moment';

export function createPlan(req,res){
    let userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }

    let params = Object.assign({}, req.body);
    if (!params.date) {
        res.json(false);
        console.log('Date fail');
        return;
    }
    let productionPlan = {
       WorkingDate : params.date,
       FactoryID : 1,
       LineID : params.lineId,
       ShiftID : params.shiftId, 
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
    // if(userId == null){
    //    res.redirect("/login");
    //    return;
    // }

    let params = Object.assign({}, req.body);
    if (!params.date) {
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
    // if(userId == null){
    //    res.redirect("/login");
    //    return;
    // }

    let data = {};
    let lineId = Number(req.params.lineId);
    if (lineId) {
        // res.json(getLstOrderByLine(lineId, false));
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

 export function getLstOrderByLine (lineId, finished) {
    var sql="SELECT * FROM productiondtl WHERE LineID = "+lineId+" AND Finished = "+finished+"";
    db.query(sql, function(err, results){
        if (err) throw err;
        return results[0];
    });  
 }
