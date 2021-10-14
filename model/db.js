//Mongo DB Connection
// var mongoose=require('mongoose');
//
// mongoose.connect('mongodb://localhost:27017/posts',{useNewUrlParser:true},error => {
//     if (!error){
//         console.log('Connection Created Successfully');
//     }
//     else {
//         console.log('Error in Database Connection: '+ error);
//     }
// });

//MYSQL DB Connection
var mysql = require('mysql');
// var config = {
//     host    : 'localhost',
//     user    : 'root',
//     password: '',
//     database: 'onecall_nodeJsCrud'
// };
var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "onecall_nodeJsCrud"
});
conn.connect(function(err) {
    // if (err) throw err;
    // console.log('Database is connected successfully !');
    if (!err){
        console.log('Connection Created Successfully');
    }
    else {
        console.log('Error in Database Connection: '+ error);
    }
});
require('./post.model');


module.exports = conn;
