
//---------------------------------------------signup page call------------------------------------------------------
export function signup(req, res){
    var message = '';
    if(req.method == "POST"){
      let params = Object.assign({}, req.body);
      let users = {
         first_name : params.first_name,
         last_name : params.last_name,
         mob_no : params.mob_no,
         user_name : params.user_name, 
         password : params.password
      }
 
      let sql = "INSERT INTO users SET ?";
 
      db.query(sql, users, function(err, result) {
         if (err) throw err;
         message = "Succesfully! Your account has been created.";
         res.render('index.ejs',{message: message});
      });
 
    } else {
      console.log(message);
       res.render('signup',{message: message});
    }
 };
  
 //-----------------------------------------------login page call------------------------------------------------------
 export function login(req, res){
      let name= req.body.username;
      let pass= req.body.password;
      let dataRes = {};
      let sql="SELECT * FROM account WHERE username='"+name+"' and password = '"+pass+"'";                           
      db.query(sql, function(err, results){      
         if(results && results.length){
            req.session.userId = results[0].id;
            req.session.userName = results[0].username;
            console.log(results[0].id);
            dataRes = {
               code : "OK",
               message : "Login SUCCESS",
               data : results[0]
            }
            res.json(dataRes);
         }
         else{
            dataRes = {
               code : "NOK",
               message : "User name or Password not correct",
               data : null
            }
            res.json(dataRes);
         }
               
      });      
 };
 //------------------------------------logout functionality----------------------------------------------
 export function logout(req,res){
    req.session.destroy(function(err) {
       if (err) {
         res.json("ERROR");
       }
       res.json("SUCCESS");
    })
 };

 