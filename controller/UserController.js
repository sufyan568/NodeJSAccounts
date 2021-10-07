const express =require('express');
const e = require("express");
const Handlebars = require('handlebars')
const mysql = require('mysql');
const exphbs=require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
var db = require('../model/db');
var router = express.Router();
var app = express();
app.engine('hbs',exphbs({extname:'hbs',defaultLayout: 'mainLayout',layoutsDir:__dirname + '/views/'}));

//Insertion create page
router.get('/create',(req,res)=>{
    res.render("users/create",{
        viewTitle : "Add New User",
    });
});
//Insert Record
router.post('/store',(req,res)=>{
    var fullNames=req.body.fullName;
    var emails=req.body.email;
    var mobiles=req.body.mobile;
    var password=req.body.password;
    var role=req.body.role;
    console.log(req.body);
    var ledgerQuery="SELECT `email`  FROM `users` WHERE `email` = '" + emails + "' ORDER BY `id` DESC LIMIT 1";
    // console.log(ledgerQuery);
    balanceLedger=db.query(ledgerQuery, (err ,data) => {
        if ((typeof data[0] !== "undefined") &&  (data[0].hasOwnProperty('email')))
        {
            res.json('User Already Exist!');
        }
        else
        {
             db.query(`INSERT INTO users (fullName,email,mobile,password,role) VALUES ('${fullNames}','${emails}','${mobiles}','${password}','${role}')`, function (err, result) {
                if (err) throw err;
                else {
                    res.redirect('./index');
                }
            });
        }
    });
});

// View All record
router.get('/index',(req,res,next)=>{
    db.query("SELECT * FROM users", function (err, data, fields) {
        if (err) throw err;
        res.render("users/index",{
            viewTitle : "List",
            list :data,
        });
    });
});

//Edit Route
router.get('/edit/:id',(req,res)=>{
    var id =req.params.id;
    var sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id],function (err, data, fields) {
        res.render("users/edit",{
            viewTitle : "Update User Details",
            users : data[0],
        });
    });
});



//Insert Record
router.post('/update',(req,res)=>{
    var data = updateUser(req,res);
});

function updateUser(req,res)
{
    var id=req.body.id;
    var fullNames=req.body.fullName;
    var emails=req.body.email;
    var mobiles=req.body.mobile;
    var password=req.body.password;
    sqlUpdate= "UPDATE `users` set `fullName` = '"+ fullNames +"' ,`email` = '"+ emails +"' , `mobile` = '"+ mobiles +"' , `password` = '"+ password +"' WHERE id = "+ id;
    db.query(sqlUpdate, function (err, result) {
        if (err) throw err;
        else{
            res.redirect('./index')
        }
    });
}
//delete route
router.get('/delete/:id',(req,res)=>{
    var id =req.params.id;
    var sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], function (err, data) {
        if (err) throw err;
        res.redirect('/user/index');
    });
});





module.exports =router;