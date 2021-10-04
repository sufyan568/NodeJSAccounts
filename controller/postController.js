const express =require('express');
const mongoose=require('mongoose');
const e = require("express");
const Posts =mongoose.model('post');
const Handlebars = require('handlebars')
const mysql = require('mysql');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
var db = require('../model/db');
var router = express.Router();

//Insertion create page
router.get('/post',(req,res)=>{
    res.render("posts/create",{
        viewTitle : "Add Or Update Post",
    });
});
//Insert Record
router.post('/post',(req,res)=>{
    res.render("posts/create",{
        viewTitle : "Add Or Update Post",
    });
    var data = insertPost(req,res);
});

function insertPost(req,res)
{
    var fullNames=req.body.fullName;
    var emails=req.body.email;
    var mobiles=req.body.mobile;
    var citys=req.body.city;
    db.query(`INSERT INTO posts (fullName,email,mobile,city) VALUES ('${fullNames}','${emails}','${mobiles}','${citys}')`, function (err, result) {
        if (err) throw err;
        else{
            res.redirect('posts/index');
        }
    });
}
// View All record
router.get('/index',(req,res,next)=>{
    db.query("SELECT * FROM posts", function (err, data, fields) {
        if (err) throw err;
        res.render("Posts/index",{
            viewTitle : "List",
            list :data,
        });
    });

});

//Edit Route
router.get('/edit/:id',(req,res)=>{
    var id =req.params.id;
    var sql = 'SELECT * FROM posts WHERE id = ?';

    db.query(sql, [id],function (err, data, fields) {
        res.render("posts/edit",{
            viewTitle : "Add Or Edit Post",
            post : data[0],
        });
    });
});



//Insert Record
router.post('/update',(req,res)=>{
    res.render("posts/edit",{
        viewTitle : "Add Or Update Post",
    });
    var data = updatePost(req,res);
});

function updatePost(req,res)
{
    var id=req.body.id;
    console.log(id)
    var fullNames=req.body.fullName;
    var emails=req.body.email;
    var mobiles=req.body.mobile;
    var citys=req.body.city;
    sqlUpdate= `UPDATE posts set fullName = ?,email = ?,mobile = ?,city = ? WHERE id = ? `;
    db.query(sqlUpdate,[fullNames,emails,mobiles,citys,id], function (err, result) {
        if (err) throw err;
        else{
          res.redirect('posts/index')
        }
    });
}
//delete route
router.get('/delete/:id',(req,res)=>{
    var id =req.params.id;
     var sql = 'DELETE FROM posts WHERE id = ?';
    db.query(sql, [id], function (err, data) {
        if (err) throw err;
       res.redirect('/post/index');
    });
});





module.exports =router;