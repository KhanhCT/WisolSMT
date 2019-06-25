export function getLstModel(req,res){
    let userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
 
    var sql="SELECT * FROM product";
    db.query(sql, function(err, results){
        res.json(results);
    });       
 };

 export function getLstLine(req,res){
    let userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
 
    var sql="SELECT * FROM productionline";
    db.query(sql, function(err, results){
        res.json(results);
    });       
 };