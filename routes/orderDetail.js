export const createProductionDtl = async(req,res) => {
    let userId = req.session.userId;
    if(userId == null){
      res.status(401).send('Unauthorized ')
      return;
    }
    let dataRes = {};
    let params = Object.assign({}, req.body);
    if (!params.date) {
        dataRes = {
            code : "NOK",
            message : "Date is error",
            data : false
         }
        console.log('Date fail');
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

    const query = async (sql) => {
        return new Promise(resolve=>{
            db.query(sql, function(err, results){
                if (err) {
                    resolve(null)
                    throw err;
                } 
                resolve(results)
            });
        })
    }

    //check exits finished = 0
    let countSql = "SELECT COUNT(*) AS numberOfProd FROM productiondtl WHERE " + " WorkingDate='"+productionDtl.WorkingDate+"' AND FactoryID ="+productionDtl.FactoryID+" AND LineID = "+productionDtl.LineID+" AND ShiftID = "+productionDtl.ShiftID+" AND Finished = 0";
    let counts = await query(countSql)
    if (counts && counts[0].numberOfProd == 0)
    {
        let insertSql="INSERT INTO productiondtl SET ?";
        db.query(insertSql,productionDtl, function(err, results){
            if (err) {
                dataRes = {
                    code : "NOK",
                    message : "Error when save to DB",
                    data : false
                 }
                res.json(dataRes);
                console.log(err);
            }
            dataRes = {
                code : "OK",
                message : "Insert success",
                data : true
             }
            res.json(dataRes);
        });   
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
    let userId = req.session.userId;
    if(userId == null){
      res.status(401).send('Unauthorized ')
      return;
    }

    let params = Object.assign({}, req.body);
    if (!params.date) {
        res.json(false);
        console.log('Date fail');
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
            res.json(false); 
            throw err; 
        }
        db.query(sqlProductionDtl + conditionSQL, function(err, result) {
          if (err) { 
            res.json(false); 
            db.rollback(function() {
              throw err;
            });
          }

          db.query(sqlProductionPlan + conditionSQL, function(err, result) {
            if (err) {
                res.json(false);  
              db.rollback(function() {
                throw err;
              });
            }  
            db.commit(function(err) {
              if (err) {
                res.json(false); 
                db.rollback(function() {
                  throw err;
                });
              }
              res.json(true);
              console.log('Transaction Complete.');
            //   db.end();
            });
          });
        });
      });
 };
