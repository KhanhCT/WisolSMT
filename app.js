import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import path from 'path';
import connection from './connectDB'
import * as user from './routes/user'
import * as product from './routes/product'
import * as production from './routes/production'
import * as productionDtl from './routes/orderDetail'
import * as modelDetail from './routes/modelDetail'
import logger  from 'morgan';
import cors from 'cors';

const app = express();

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

app.set('port', process.env.PORT || 6969);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cors());
app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 86400000 }
            }))
 
// development only
 
app.post('/signup', user.signup);//call for signup post 
app.post('/login', user.login);//call for login post
app.get('/logout', user.logout);//call for logout

app.get('/product/getLstModel',product.getLstModel);
app.get('/product/getLstLine',product.getLstLine);
app.get('/product/getShifts',product.getShifts);

app.post('/production/createPlan',production.createPlan);
app.post('/production/initProduct',production.updatePlan);
app.get('/production/getLineResult/:date',production.getLineResult);
app.get('/production/getPlanOfLine/:date/:factoryID/:lineId/:shipId',production.getPlanOfLine);

//Production Detail
app.post('/production/createOrderDtl',productionDtl.createProductionDtl);
app.post('/production/submitOrderDtl',productionDtl.submitOrderDtl);
app.post('/production/updateMessage',productionDtl.updateMessage);
app.get('/production/getLstOrderNotFinish/:lineId',productionDtl.getLstOrderNotFinish);
app.get('/production/getLstOrderByDate',productionDtl.getLstOrderByDate);

//Model Detail
app.post('/model/importProduct',modelDetail.importProduct);
app.post('/model/exportProduct',modelDetail.exportProduct);
app.get('/model/getModelResult/:date',modelDetail.getModelResult);

//Middleware
app.listen(6969)