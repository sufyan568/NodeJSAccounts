const mongoose =require('mongoose');
const mysql =require('mysql');

var postSchema =new mongoose.Schema({
   fullName:{
       type:String,
       required:'This field is required',
   },
    email:{
        type:String,
        required:'This field is required',
    },
    mobile:{
        type:String,
        required:'This field is required',
    },
    city:{
        type:String,
        required:'This field is required',
    },
});

mongoose.model('post',postSchema);