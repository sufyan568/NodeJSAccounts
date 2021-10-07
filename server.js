require('./model/db');
const nodemon=require('nodemon');
const express= require('express');
const path=require('path');
const exphbs=require('express-handlebars');
const bodyParser=require('body-parser');
var router = express.Router();
// const http=require('http');
const postController=require('./controller/postController');
const UserController=require('./controller/UserController');
const LedgerController=require('./controller/LedgerController');
const AdminController=require('./controller/AdminController');
// const ImporterController=require('./controller/ImporterController');

const passport = require('passport');

var app = express();

app.use(express.urlencoded({
    extended:true
}));

app.use(express.json());

app.set('views',path.join(__dirname,'./views/'));

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(flash());

app.engine('hbs',exphbs({
    extname:'hbs',
    defaultLayout: 'mainLayout',
    layoutsDir:__dirname + '/views/layouts/'
}));

app.set('view engine','hbs');
app.listen(3000 ,() =>{
    // console.log('Express Server is Started at port : 3000');
});

app.use('/post',postController);
app.use('/user',UserController);
app.use('/ledger',LedgerController);
app.use('/admin',AdminController);
// app.use('/importer',ImporterController);