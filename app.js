import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import mysql from 'mysql';
import path from 'path';
import * as routes from './routes'
import * as user from './routes/user'
import logger  from 'morgan';

const app = express();

const connection = mysql.createConnection({
    host     : '127.0.0.1',
    port: "3306",
    user     : 'root',
    password : '',
    database : 'smt'
  });

  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
  });

global.db = connection;

app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 60000 }
            }))
 
// development only
 
app.get('/', routes.index);//call for main index page
app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);//call for signup post 
app.get('/login', routes.index);//call for login page
app.post('/login', user.login);//call for login post
app.get('/home/dashboard', user.dashboard);//call for dashboard page after login
app.get('/home/logout', user.logout);//call for logout
app.get('/home/profile',user.profile);//to render users profile
//Middleware
app.listen(8080)