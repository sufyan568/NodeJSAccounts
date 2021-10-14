const express =require('express');
const e = require("express");
const Handlebars = require('handlebars')
const mysql = require('mysql');
const exphbs=require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
var db = require('../model/db');
var router = express.Router();
var app = express();
const options=require('../helpers/helper');
const data=require('../helpers/data');
const fs =require('fs');
const path=require('path');
const pdf =require('pdf-creator-node');

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

//Download User Record Pdf route
router.get('/downloadPdf/:id',(req,res)=>{
    var id =req.params.id;
    generatePdf();
});

const generatePdf = async(req,res,next)=>{
    const html = fs.readFileSync(path.join(__dirname,'../views/template.html'),'utf-8');
    const filename=Math.random()+'_doc'+'.pdf';
    let array=[];
    data.forEach(d=>{
        const users= {
            name:d.name,
            description : d.description,
            unit : d.unit,
            quantity : d.quantity,
            price :d.price,
            total : d.quantity * d.price,
            imgurl:d.imgurl,

        }
        array.push(users);
    });
    let subtotal =0;
    array.forEach(i =>{
        subtotal +=i.total
    });
    const tax= (subtotal*20)/100;
    const grandTotal=subtotal-tax;
    const obj={
        productlist:array,
        subtotal:subtotal,
        tax:tax,
        grandTotal:grandTotal
    }
    const document =
    {
        html:html,
        data: {
            products:obj 
        },
        path:'./docs/'+filename
    }
    
    pdf.create(document,options)
    .then(res => {
        console.log(res);
    }).catch(error =>{
        console.log(error);

    });
    const filepath='http:localhost:3000/docs/'+filename;
 
    res.redirect('user/index');
    

}





module.exports =router;