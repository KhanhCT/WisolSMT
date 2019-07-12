import * as query from '../until/common';
import moment from 'moment';
import db from '../connectDB'
export const createProductionDtl = async(req,res) => {
  let dataRes = {};
  // let userId = req.session.userId;
  // if(userId == null){
  //   dataRes = {
  //       code : "NOK",
  //       message : "Unauthorized",
  //       data : false
  //    }
  //   res.status(401).send(dataRes)
  //   return;
  // }
  let params = Object.assign({}, req.body);
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
  let productionDtl = {
      WorkingDate : params.WorkingDate,
      FactoryID : params.FactoryID,
      ProductID : params.ProductID,
      LineID : params.LineID,
      ShiftID : params.ShiftID, 
      Amount : params.Amount,
      Finished : params.Finished
  }

  //check exits finished = 0
  let countSql = "SELECT COUNT(*) AS numberOfProd FROM productiondtl WHERE " + " WorkingDate='"+productionDtl.WorkingDate+"' AND ProductID = "+productionDtl.ProductID+" AND FactoryID ="+productionDtl.FactoryID+" AND LineID = "+productionDtl.LineID+" AND ShiftID = "+productionDtl.ShiftID+" AND Finished = 0";
  let counts = await query.queryNormal(countSql);
  if (counts && counts[0].numberOfProd == 0)
  {
    let insertEqual = await query.queryInsert("INSERT INTO productiondtl SET ?", productionDtl);
    if (insertEqual) {
      dataRes = {
        code : "OK",
        message : "Insert success",
        data : true
      }
      res.json(dataRes);
    } else {
      dataRes = {
        code : "NOK",
        message : "Error when save to DB",
        data : false
      }
      res.json(dataRes);
    }
  } else {
    dataRes = {
        code : "NOK",
        message : "The product has not yet been completed",
        data : false
      }
    res.json(dataRes);
  } 
};

 export const submitOrderDtl = async(req,res) =>{
  let dataRes = {};
  // let userId = req.session.userId;
  // if(userId == null){
  //   dataRes = {
  //       code : "NOK",
  //       message : "Unauthorized",
  //       data : false
  //    }
  //   res.status(401).send(dataRes)
  //   return;
  // }

  let params = Object.assign({}, req.body);
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
  let productionDtl = {
    WorkingDate : params.WorkingDate,
    FactoryID : params.FactoryID,
    ProductID : params.ProductID,
    LineID : params.LineID,
    ShiftID : params.ShiftID, 
    Amount : params.Amount,
    StopTime : moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  }
  let countSql = "SELECT COUNT(*) AS numberOfProd FROM productiondtl WHERE " + " WorkingDate='"+productionDtl.WorkingDate+"' AND ProductID = "+productionDtl.ProductID+" AND FactoryID ="+productionDtl.FactoryID+" AND LineID = "+productionDtl.LineID+" AND ShiftID = "+productionDtl.ShiftID+" AND Finished = false";
  let counts = await query.queryNormal(countSql);
  if (counts && counts[0].numberOfProd == 0) {
    dataRes = {
      code : "NOK",
      message : "Please create production detail",
      data : false
    }
    res.json(dataRes);
    return;
  }

  var conditionSQL = " WorkingDate='"+productionDtl.WorkingDate+"' AND FactoryID ="+productionDtl.FactoryID+" AND LineID = "+productionDtl.LineID+" AND ShiftID = "+productionDtl.ShiftID+" AND ProductID = "+productionDtl.ProductID+"";
  var sqlProductionDtl="UPDATE productiondtl SET StopTime = '"+productionDtl.StopTime+"', Finished = true WHERE ";
  var sqlProductionPlan = "UPDATE productionplan SET OrderedQty = OrderedQty + "+productionDtl.Amount+",RemainQty = RemainQty + "+productionDtl.Amount+" WHERE ";
  db.beginTransaction(function(err) {
      if (err) { 
        dataRes = {
          code : "NOK",
          message : err.sqlMessage,
          data : false
        }
        res.json(dataRes);
      }
      db.query(sqlProductionDtl + conditionSQL + " AND Finished = false", function(err, result) {
        if (err) { 
          db.rollback(function() {
            dataRes = {
              code : "NOK",
              message : err.sqlMessage,
              data : false
            }
            res.json(dataRes);
          });
        }

        db.query(sqlProductionPlan + conditionSQL, function(err, result) {
          if (err) {
            db.rollback(function() {
              dataRes = {
                code : "NOK",
                message : err.sqlMessage,
                data : false
              }
              res.json(dataRes);
            });
          }  
          db.commit(function(err) {
            if (err) {
              db.rollback(function() {
                dataRes = {
                  code : "NOK",
                  message : err.sqlMessage,
                  data : false
                }
                res.json(dataRes);
              });
            }
            dataRes = {
              code : "OK",
              message : "Submit success",
              data : false
            }
            res.json(dataRes);
            console.log('Transaction Complete.');
          });
        });
      });
    });
 };

 export const updateMessage = async(req,res) => {
  let dataRes = {};
  let params = Object.assign({}, req.body);
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
  let productionDtl = {
      WorkingDate : params.WorkingDate,
      FactoryID : params.FactoryID,
      LineID : params.LineID,
      ShiftID : params.ShiftID, 
      Message : params.Message
  }

  //check exits finished = 0
  let countSql = "SELECT COUNT(*) AS numberOfProd FROM productiondtl WHERE " + " WorkingDate='"+productionDtl.WorkingDate+"' AND ProductID = "+productionDtl.ProductID+" AND FactoryID ="+productionDtl.FactoryID+" AND LineID = "+productionDtl.LineID+" AND ShiftID = "+productionDtl.ShiftID+" AND Finished = 0";
  let counts = await query.queryNormal(countSql);
  if (counts && counts[0].numberOfProd == 0)
  {
    dataRes = {
      code : "NOK",
      message : "Please create production detail",
      data : false
    }
  } else {
    let updateSql = "UPDATE productiondtl SET Message = '" +productionDtl.Message+ "' WHERE " + " WorkingDate='"+productionDtl.WorkingDate+"' AND ProductID = "+productionDtl.ProductID+" AND FactoryID ="+productionDtl.FactoryID+" AND LineID = "+productionDtl.LineID+" AND ShiftID = "+productionDtl.ShiftID +" AND Finished = 0";
    let updateObj = await query.queryNormal(updateSql);
    if (updateObj) {
      dataRes = {
        code : "OK",
        message : "Update message success",
        data : true
      }
    } else {
      dataRes = {
        code : "NOK",
        message : "Update error",
        data : false
      }
    }
  } 
  res.json(dataRes);
};

export function getLstOrderNotFinish(req,res){
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
          if (results) {
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

export function getLstOrderByDate(req,res){
  let dataRes = {};
  let date = moment(req.params.date, 'DD-MM-YYYY', true);
  if (!date.isValid()) {
      dataRes = {
          code : "NOK",
          message : "Date is error, please set format DD-MM-YYYY",
          data : false
        }
      res.json(dataRes);
      return;
  }

  var sql="SELECT * FROM productiondtl WHERE WorkingDate = '"+req.params.date+"'";
  console.log(sql);
  db.query(sql, function(err, results){
      if (err) {
          dataRes = {
            code : "NOK",
            message : err.sqlMessage,
            data : null
          }
          res.json(dataRes);
      }
      if (results) {
          dataRes = {
              code : "OK",
              message : "getLstOrder success",
              data : results
            }
            res.json(dataRes);
      }
  });  
};
