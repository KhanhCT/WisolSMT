import moment from 'moment';
import db from '../connectDB'
import * as query from '../until/common';

export function createPlan(req,res){
    let dataRes = {};
    let userId = req.session.userId;
    if(userId == null){
        dataRes = {
            code : "NOK",
            message : "Unauthorized",
            data : false
         }
        res.status(401).send(dataRes)
        return;
    }
    let params = Object.assign({}, req.body);
    let date = moment(params.date, 'DD-MM-YYYY');
    if (!date.isValid()) {
        dataRes = {
            code : "NOK",
            message : "Date is error, please set format DD-MM-YYYY",
            data : false
         }
        res.json(dataRes);
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
        if (err) {
            dataRes = {
              code : "NOK",
              message : err.sqlMessage,
              data : false
           }
           console.log(err);
           res.json(dataRes);
          }
          if (results) {
            dataRes = {
              code : "OK",
              message : "INSERT productionplan success",
              data : true
           }
            res.json(dataRes);
          }
    });       
 };

 export function updatePlan(req,res){
    let dataRes = {};
    let userId = req.session.userId;
    if(userId == null){
        dataRes = {
            code : "NOK",
            message : "Unauthorized",
            data : false
         }
        res.status(401).send(dataRes)
        return;
    }
    let params = Object.assign({}, req.body);
    let date = moment(params.date, 'DD-MM-YYYY');
    if (!date.isValid()) {
        dataRes = {
            code : "NOK",
            message : "Date is error, please set format DD-MM-YYYY",
            data : false
         }
        res.json(dataRes);
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
            dataRes = {
              code : "NOK",
              message : err.sqlMessage,
              data : false
           }
           res.json(dataRes);
          }
        if (results) {
            console.log(results);
            dataRes = {
                code : "OK",
                message : "Update productionplan success",
                data : true
            }
            res.json(dataRes);
        }
    });       
 };

 export function getLstOrderNotFinish(req,res){
    let dataRes = {};
    let userId = req.session.userId;
    if(userId == null){
        dataRes = {
            code : "NOK",
            message : "Unauthorized",
            data : false
         }
        res.status(401).send(dataRes)
        return;
    }

    let lineId = Number(req.params.lineId);
    if (lineId) {
        var sql="SELECT * FROM productiondtl WHERE LineID = "+lineId+" AND Finished = false";
        db.query(sql, function(err, results){
            if (err) {
                dataRes = {
                  code : "NOK",
                  message : err.sqlMessage,
                  data : null
               }
               res.json(dataRes);
            }
            if (results && results.length > 0) {
                dataRes = {
                    code : "OK",
                    message : "getLstOrderNotFinish success",
                    data : results
                 }
                 res.json(dataRes);
            }
        });  
    }
 };

 export const getLineResult = async (req,res) => {
    let dataRes = {};
    let userId = req.session.userId;
    if(userId == null){
        dataRes = {
            code : "NOK",
            message : "Unauthorized",
            data : false
         }
        res.status(401).send(dataRes)
        return;
    }
    let dateStr = req.params.date;
    let date = moment(dateStr, 'DD-MM-YYYY');
    if (!date.isValid()) {
        dataRes = {
            code : "NOK",
            message : "Date is error, please set format DD-MM-YYYY",
            data : false
         }
        res.json(dataRes);
        return;
    }
    let lstLines = await query.queryNormal("SELECT * FROM productionline");
    let lstModel = await query.queryNormal("SELECT * FROM product");
    if (!lstLines || !lstModel) {
        dataRes = {
            code : "NOK",
            message : "ERROR when query",
            data : null
         }
        res.json(dataRes);
        return;
    }
    var result = [];
    if (lstLines.length > 0) {
        for (let i = 0; i < lstLines.length; i++) {
            let dataLine = {};
            dataLine.lineId = lstLines[i].LineID;
            let countProd = await query.queryNormal("SELECT COUNT(*) AS amount FROM productiondtl WHERE WorkingDate = '"+dateStr+"' AND LineID = '"+lstLines[i].LineID+"' AND Finished = false");
            if (countProd[0].amount > 0) {
                dataLine.status = "ORDERING"
            } else {
                dataLine.status = "RUN"
            }
            let prodPlan = await query.queryNormal ("SELECT * FROM productionplan WHERE WorkingDate = '"+dateStr+"' AND LineID = '"+lstLines[i].LineID+"'");
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
    dataRes = {
        code : "OK",
        message : "getLineResult sucess",
        data : result
     }
    res.json(dataRes);
}
