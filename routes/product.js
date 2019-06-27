import db from '../connectDB'
export function getLstModel(req,res){
  let dataRes = {};
  let userId = req.session.userId;
  if(userId == null){
    dataRes = {
        code : "NOK",
        message : "Unauthorized",
        data : null
     }
    res.status(401).send(dataRes)
    return;
  }

  var sql="SELECT * FROM product";
  db.query(sql, function(err, results){
    if (err) {
      dataRes = {
        code : "NOK",
        message : "ERROR when query",
        data : null
     }
     res.json(dataRes);
    }
    if (results && results.length > 0) {
      dataRes = {
        code : "OK",
        message : "Get list model success",
        data : JSON.parse(JSON.stringify(results))
     }
      res.json(dataRes);
    }
  });       
};

 export function getLstLine(req,res){
  let dataRes = {};
  let userId = req.session.userId;
  if(userId == null){
    dataRes = {
        code : "NOK",
        message : "Unauthorized",
        data : null
     }
    res.status(401).send(dataRes)
    return;
  }
 
  var sql="SELECT * FROM productionline";
  db.query(sql, function(err, results){
    if (err) {
      dataRes = {
        code : "NOK",
        message : "ERROR when query",
        data : null
     }
     res.json(dataRes);
    }
    if (results && results.length > 0) {
      dataRes = {
        code : "OK",
        message : "Get list line success",
        data : JSON.parse(JSON.stringify(results))
     }
      res.json(dataRes);
    }
  });       
};

export function getShifts(req,res){
  let dataRes = {};
  let userId = req.session.userId;
  if(userId == null){
    dataRes = {
        code : "NOK",
        message : "Unauthorized",
        data : null
     }
    res.status(401).send(dataRes)
    return;
  }
 
  var sql="SELECT * FROM shift";
  db.query(sql, function(err, results){
    if (err) {
      dataRes = {
        code : "NOK",
        message : "ERROR when query",
        data : null
     }
     res.json(dataRes);
    }
    if (results && results.length > 0) {
      dataRes = {
        code : "OK",
        message : "Get list shift success",
        data : JSON.parse(JSON.stringify(results))
     }
      res.json(dataRes);
    }
  });       
};