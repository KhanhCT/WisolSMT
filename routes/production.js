import moment from 'moment';
import db from '../connectDB'
import * as query from '../until/common';

export function createPlan(req,res){
    let dataRes = {};
    // let userId = req.session.userId;
    // if(userId == null){
    //     dataRes = {
    //         code : "NOK",
    //         message : "Unauthorized",
    //         data : false
    //      }
    //     res.status(401).send(dataRes)
    //     return;
    // }
    let params = Object.assign({}, req.body);
    console.log(params);
    let date = moment(params.WorkingDate, 'DD-MM-YYYY', true);
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
       WorkingDate : params.WorkingDate,
       FactoryID : params.FactoryID,
       LineID : params.LineID,
       ShiftID : params.ShiftID,
       ProductID : params.ProductID, 
       OrderedQty : params.OrderedQty,
       GoodProdQty : 0,
       RemainQty : params.OrderedQty
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
    // let userId = req.session.userId;
    // if(userId == null){
    //     dataRes = {
    //         code : "NOK",
    //         message : "Unauthorized",
    //         data : false
    //      }
    //     res.status(401).send(dataRes)
    //     return;
    // }
    let params = Object.assign({}, req.body);
    console.log(params);
    let date = moment(params.WorkingDate, 'DD-MM-YYYY', true);
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
       WorkingDate : params.WorkingDate,
       FactoryID : params.FactoryID,
       LineID : params.LineID,
       ShiftID : params.ShiftID,
       GoodProdQty : params.GoodProdQty
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

 export const getLineResult = async (req,res) => {
    let dataRes = {};
    let userId = req.session.userId;
    // if(userId == null){
    //     dataRes = {
    //         code : "NOK",
    //         message : "Unauthorized",
    //         data : false
    //      }
    //     res.status(401).send(dataRes)
    //     return;
    // }
    let dateStr = req.params.date;
    let date = moment(dateStr, 'DD-MM-YYYY', true);
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
            dataLine.line_name = lstLines[i].Description;
            let countProd = await query.queryNormal("SELECT COUNT(*) AS amount FROM productiondtl WHERE WorkingDate = '"+dateStr+"' AND LineID = '"+lstLines[i].LineID+"' AND Finished = false");
            if (countProd[0].amount > 0) {
                dataLine.status = "ORDERING"
                dataLine.color = "8E1E20";
            } else {
                dataLine.status = "RUN"
                dataLine.color = "5BBD2B";
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

export const getPlanOfLine = async(req,res) =>{
    let dataRes = {
        code : "OK",
        message : "SUCCESS",
        data : {
            modelID : 0,
            modelName : "",
            order : 0,
            elapsed : 0,
            remain : 0
        }
    };
    const lineId = Number(req.params.lineId);
    const factoryID = Number(req.params.factoryID);
    const workingDate = req.params.date;
    const shipId = req.params.shipId;
    let date = moment(workingDate, 'DD-MM-YYYY', true);
    if (!date.isValid()) {
        dataRes = {
            code : "NOK",
            message : "Date is error, please set format DD-MM-YYYY",
            data : null
         }
        res.json(dataRes);
        return;
    }

    let lstModel = await query.queryNormal("SELECT * FROM product");
    var sql="SELECT * FROM productionplan WHERE WorkingDate = '"+workingDate+"' AND FactoryID = '"+factoryID+"' AND LineID = "+lineId+" AND ShiftID = '"+shipId+"'";
    let lstPlanOfLine = await query.queryNormal(sql);
    if (lstPlanOfLine && lstPlanOfLine.length > 0) {
        let modelName = "";
        if (lstModel && lstModel.length > 0) {
            for (let i = 0;i<lstModel.length;i++) {
                if (lstModel[i].id == lstPlanOfLine[0].ProductID) {
                    modelName = lstModel[i].product_name;
                }
            }
        }
        dataRes.data = {
            modelID : lstPlanOfLine[0].ProductID,
            modelName : modelName,
            order : lstPlanOfLine[0].OrderedQty,
            elapsed : lstPlanOfLine[0].GoodProdQty,
            remain : lstPlanOfLine[0].RemainQty
        }
    }
    res.json(dataRes);
 };