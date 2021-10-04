require('../model/db');
const nodemon=require('nodemon');
const express= require('express');
const path=require('path');
const exphbs=require('express-handlebars');
const bodyParser=require('body-parser');
var router = express.Router();

var app = express();

const AdminController=require('../controller/AdminController');

app.set('views',path.join(__dirname,'./views/'));
app.engine('hbs',exphbs({extname:'hbs',defaultLayout: 'mainLayout',layoutsDir:__dirname + '/views/layouts/'}));



app.use('/admin',AdminController);

module.exports =router;
