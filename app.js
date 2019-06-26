import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import mysql from 'mysql';
import path from 'path';
import * as user from './routes/user'
import * as product from './routes/product'
import * as production from './routes/production'
import * as productionDtl from './routes/orderDetail'
import logger  from 'morgan';

const app = express();

const connection = mysql.createConnection({
    host     : '127.0.0.1',
    port: "3306",
    user     : 'root',
    password : '',
    database : 'smt',
    typeCast: function castField( field, useDefaultTypeCasting ) {
      // We only want to cast bit fields that have a single-bit in them. If the field
      // has more than one bit, then we cannot assume it is supposed to be a Boolean.
      if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
          var bytes = field.buffer();
          // A Buffer in Node represents a collection of 8-bit unsigned integers.
          // Therefore, our single "bit field" comes back as the bits '0000 0001',
          // which is equivalent to the number 1.
          return( bytes[ 0 ] === 1 );
      }
      return( useDefaultTypeCasting() );

  }
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
 
app.post('/signup', user.signup);//call for signup post 
app.post('/login', user.login);//call for login post
app.get('/logout', user.logout);//call for logout

app.get('/product/getLstModel',product.getLstModel);
app.post('/production/createPlan',production.createPlan);
app.post('/production/initProduct',production.updatePlan);
app.get('/production/getLstOrderNotFinish/:lineId',production.getLstOrderNotFinish);

//Production Detail
app.post('/production/createOrderDtl',productionDtl.createProductionDtl);
app.post('/production/submitOrderDtl',productionDtl.submitOrderDtl);

//Middleware
app.listen(8080)