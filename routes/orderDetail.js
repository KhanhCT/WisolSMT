import * as query from '../until/common';
import moment from 'moment';
import db from '../connectDB'
export const createProductionDtl = async(req,res) => {
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
  let productionDtl = {
      WorkingDate : params.date,
      FactoryID : 1,
      LineID : params.lineId,
      ShiftID : params.shiftId, 
      Amount : params.amount,
      Finished : false
  }

  //check exits finished = 0
  let countSql = "SELECT COUNT(*) AS numberOfProd FROM productiondtl WHERE " + " WorkingDate='"+productionDtl.WorkingDate+"' AND FactoryID ="+productionDtl.FactoryID+" AND LineID = "+productionDtl.LineID+" AND ShiftID = "+productionDtl.ShiftID+" AND Finished = 0";
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

 export function submitOrderDtl(req,res){
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
  let productionDtl = {
      WorkingDate : params.date,
      FactoryID : 1,
      LineID : params.lineId,
      ShiftID : params.shiftId,
      Amount : params.amount
  }
  var conditionSQL = " WorkingDate='"+productionDtl.WorkingDate+"' AND FactoryID ="+productionDtl.FactoryID+" AND LineID = "+productionDtl.LineID+" AND ShiftID = "+productionDtl.ShiftID+"";
  var sqlProductionDtl="UPDATE productiondtl SET Finished = true WHERE ";
  var sqlProductionPlan = "UPDATE productionplan SET OrderedQty = OrderedQty + "+productionDtl.Amount+",RemainQty = RemainQty + "+productionDtl.Amount+" WHERE ";
  db.beginTransaction(function(err) {
      if (err) { 
        dataRes = {
          code : "NOK",
          message : "ERROR Transaction 1",
          data : false
        }
        res.json(dataRes);
      }
      db.query(sqlProductionDtl + conditionSQL + " AND Finished = false", function(err, result) {
        if (err) { 
          res.json(false); 
          db.rollback(function() {
            dataRes = {
              code : "NOK",
              message : "ERROR Transaction 2",
              data : false
            }
            res.json(dataRes);
          });
        }

        db.query(sqlProductionPlan + conditionSQL, function(err, result) {
          if (err) {
              res.json(false);  
            db.rollback(function() {
              dataRes = {
                code : "NOK",
                message : "ERROR Transaction 3",
                data : false
              }
              res.json(dataRes);
            });
          }  
          db.commit(function(err) {
            if (err) {
              res.json(false); 
              db.rollback(function() {
                dataRes = {
                  code : "NOK",
                  message : "ERROR Transaction 4",
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
