
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
    var message = ''; 
 
    if(req.method == "POST"){
       var name= req.body.username;
       var pass= req.body.password;
      
       var sql="SELECT * FROM account WHERE username='"+name+"' and password = '"+pass+"'";                           
       db.query(sql, function(err, results){      
          if(results && results.length){
             req.session.userId = results[0].id;
             req.session.userName = results[0].username;
             console.log(results[0].id);
             res.redirect('/home/dashboard');
          }
          else{
             message = 'Wrong Credentials.';
             res.render('index.ejs',{message: message});
          }
                  
       });
    } else {
       res.render('index.ejs',{message: message});
    }
            
 };
 //-----------------------------------------------dashboard page functionality----------------------------------------------
            
 export function dashboard(req, res, next){
            
    var userName =  req.session.userName,
    userId = req.session.userId;
    console.log('ddd='+userId);
    if(userId == null){
       res.redirect("/login");
       return;
    }
 
    var sql="SELECT * FROM account WHERE id='"+userId+"'";
 
    db.query(sql, function(err, results){
       res.render('dashboard.ejs', {user:userName});    
    });       
 };
 //------------------------------------logout functionality----------------------------------------------
 export function logout(req,res){
    req.session.destroy(function(err) {
       res.redirect("/login");
    })
 };
 //--------------------------------render user details after login--------------------------------
 export function profile(req, res){
 
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
 
    var sql="SELECT * FROM account WHERE id='"+userId+"'";          
    db.query(sql, function(err, result){  
       res.render('profile.ejs',{data:result});
    });
 };
 //---------------------------------edit users details after login----------------------------------
 export function editprofile(req,res){
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
 
    var sql="SELECT * FROM account WHERE id='"+userId+"'";
    db.query(sql, function(err, results){
       res.render('edit_profile.ejs',{data:results});
    });
 };
 