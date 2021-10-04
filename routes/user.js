require('../server');
require('../model/db');
const nodemon=require('nodemon');
const express= require('express');
const path=require('path');
const exphbs=require('express-handlebars');
const bodyParser=require('body-parser');
var router = express.Router();

var app = express();

const postController=require('../controller/postController');
const UserController=require('../controller/UserController');
const LedgerController=require('../controller/LedgerController');


app.set('views',path.join(__dirname,'./views/'));


app.engine('hbs',exphbs({extname:'hbs',defaultLayout: 'mainLayout',layoutsDir:__dirname + '/views/layouts/'}));

app.set('view engine','hbs');

app.use('/post',postController);
app.use('/user',UserController);
app.use('/ledger',LedgerController);


module.exports =router;