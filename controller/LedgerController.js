const express = require('express');
const e = require("express");
const Handlebars = require('handlebars')
const mysql = require('mysql');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
var db = require('../model/db');
var router = express.Router();

//Insertion create page
router.get('/create', (req, res) => {
    db.query("SELECT id, fullName FROM users", function (err, data, fields) {
        if (err) throw err;
        res.render("ledger/create", {
            viewTitle: "Add New Ledger",
            users: data,
        });
    });
});
//Insert Record
router.post('/store', (req, res) => {
    var data = insertLedger(req, res);
});

function insertLedger(req, res) {
    var user_id = req.body.user_id;
    var credit = req.body.credit;
    var debit = req.body.debit;
    var balance = credit - debit;
    db.query(`INSERT INTO ledger (user_id,credit,debit,balance) VALUES ('${user_id}','${credit}','${debit}','${balance}')`, function (err, result) {
        if (err) throw err;
        else {
            res.redirect('./index');
        }
    });
}
// View All record
router.get('/index', (req, res, next) => {
    $user = 'SELECT fullName,credit,debit,balance,datetime,ledger.id FROM ledger JOIN users ON ledger.user_id=users.id;';
    // SELECT (SUM(`credit`)-SUM(`debit`)) AS 'balance', FROM `ledger` WHERE `user_id`='$userId'
    db.query($user, function (err, data, fields) {
        if (err) throw err;
        res.render("ledger/index", {
            viewTitle: "List",
            list: data,
        });
    });

});

//Edit Route
router.get('/edit/:id', (req, res) => {
    var id = req.params.id;
    var sql = 'SELECT * FROM ledger WHERE id = ?';

    db.query(sql, [id], function (err, data, fields) {
        res.render("ledger/edit", {
            viewTitle: "Add Or Edit User",
            users: data[0],
        });
    });
});



//Insert Record
router.post('/update', (req, res) => {
    var data = updateLedger(req, res);
});

function updateLedger(req, res) {
    var id = req.body.id;
    var fullNames = req.body.fullName;
    var emails = req.body.email;
    var mobiles = req.body.mobile;
    sqlUpdate = `UPDATE ledger set user_id = ?,credit = ?,debit = ? WHERE id = ? `;
    db.query(sqlUpdate, [fullNames, emails, mobiles, id], function (err, result) {
        if (err) throw err;
        else {
            res.redirect('ledger/index')
        }
    });
}
//delete route
router.get('/delete/:id', (req, res) => {
    var id = req.params.id;
    var sql = 'DELETE FROM ledger WHERE id = ?';
    db.query(sql, [id], function (err, data) {
        if (err) throw err;
        res.redirect('/ledger/index');
    });
});

//view unique user ledger route
router.get('/details/:id', (req, res) => {
    var id = req.params.id;
    var UserDetails = 'SELECT fullName,credit,debit,balance,datetime,ledger.id,role FROM ledger JOIN users ON ledger.user_id = users.id WHERE user_id = ' + id;
    var type = '';
    db.query(UserDetails, function (err, data, fields) {
        console.log(data[0]);
       if ((typeof data[0] === 'undefined') ) {
            var UserDetails = 'SELECT * FROM users WHERE id = ' + id;
            db.query(UserDetails, function (err, data, fields) {
                if (data[0].role == 'Admin') {
                    type = 'Admin';
                }
                else {
                    type = null;
                }
            });
          
        }
        else {

            if (data[0].role == 'Admin') {
                type = 'Admin';
            }
            else {
                type = null;
            }
          }
            res.render("ledger/indexUserDetail", {
                viewTitle: "View Single User Account Details",
                list: data,
                user_id: id,
                role: type,
            });
        
    });
});

//create unique user credit ledger route
router.get('/createCredit/:id', (req, res) => {
    var id = req.params.id;
    var ledgerQuery = 'SELECT `balance`  FROM `ledger` WHERE `user_id` = ' + id + ' ORDER BY `id` DESC LIMIT 1';
    db.query(ledgerQuery, (err, data) => {
        // console.log(data);
        if (err) throw err;
        else if ((typeof data[0] !== "undefined") && (data[0].hasOwnProperty('balance'))) {

            res.render("ledger/createCredit", {
                viewTitle: "Balance Credit the User",
                balance: "User Current Balance : " + data[0].balance,
                id: id,
            });
        }
        else {

            res.render("ledger/createCredit", {
                viewTitle: "Balance Debit the User",
                balance: "Current Balance" + 0,
                id: id,
            });

        }
    });

});

//create unique user credit ledger route
router.get('/createDebit/:id', (req, res) => {
    var id = req.params.id;
    var ledgerQuery = 'SELECT `balance`  FROM `ledger` WHERE `user_id` = ' + id + ' ORDER BY `id` DESC LIMIT 1';
    db.query(ledgerQuery, (err, data) => {
        // console.log(data);
        if (err) throw err;
        else if ((typeof data[0] !== "undefined") && (data[0].hasOwnProperty('balance'))) {

            res.render("ledger/createDebit", {
                viewTitle: "Balance Debit",
                balance: "User Current Balance : " + data[0].balance,
                id: id,
            });

        }
        else {

            res.render("ledger/createDebit", {
                viewTitle: "Balance Debit the User",
                balance: "Current Balance" + 0,
                id: id,
            });

        }
    });
});

//Insert Credit Balance Record
router.post('/storeCredit', (req, res) => {
    var data = insertCreditLedger(req, res);
});

function insertCreditLedger(req, res) {
    var user_id = req.body.user_id;
    var credit = req.body.credit;
    var debit = req.body.debit;
    var balance = credit - debit;
    var balanceLedger = 0;
    var updateBalance = 0;
    var ledgerQuery = 'SELECT `balance`  FROM `ledger` WHERE `user_id` = ' + user_id + ' ORDER BY `id` DESC LIMIT 1';
    balanceLedger = db.query(ledgerQuery, (err, data) => {
        if (err) throw err;
        else if ((typeof data[0] !== "undefined") && (data[0].hasOwnProperty('balance'))) {
            updateBalance = parseInt(data[0].balance) + parseInt(credit);
            db.query(`INSERT INTO ledger (user_id,credit,debit,balance) VALUES ('${user_id}','${credit}','${debit}','${updateBalance}')`, function (err, result) {
                if (err) throw err;
                else {
                    res.redirect('../ledger/details/' + user_id);
                }
            });
        }
        else {
            updateBalance = 0 + parseInt(credit);
            db.query(`INSERT INTO ledger (user_id,credit,debit,balance) VALUES ('${user_id}','${credit}','${debit}','${updateBalance}')`, function (err, result) {
                if (err) throw err;
                else {
                    res.redirect('../ledger/details/' + user_id);
                }
            });
        }
    });
    // console.log(ledgerQuery, updateBalance);

}
//Insert Credit Balance Record
router.post('/storeDebit', (req, res) => {
    var data = insertDebitLedger(req, res);
});

function insertDebitLedger(req, res) {
    var user_id = req.body.user_id;
    var credit = req.body.credit;
    var debit = req.body.debit;
    var balance = credit - debit;
    var balanceLedger = 0;
    var updateBalance = 0;
    var ledgerQuery = 'SELECT `balance`  FROM `ledger` WHERE `user_id` = ' + user_id + ' ORDER BY `id` DESC LIMIT 1';
    balanceLedger = db.query(ledgerQuery, (err, data) => {
        if (err) throw err;
        else if ((typeof data[0] !== "undefined") && (data[0].hasOwnProperty('balance'))) {
            updateBalance = parseInt(data[0].balance) - parseInt(debit);
            db.query(`INSERT INTO ledger (user_id,credit,debit,balance) VALUES ('${user_id}','${credit}','${debit}','${updateBalance}')`, function (err, result) {
                if (err) throw err;
                else {
                    res.redirect('../ledger/details/' + user_id);
                }
            });
        }
        else {
            updateBalance = 0 - parseInt(debit);
            db.query(`INSERT INTO ledger (user_id,credit,debit,balance) VALUES ('${user_id}','${credit}','${debit}','${updateBalance}')`, function (err, result) {
                if (err) throw err;
                else {
                    res.redirect('../ledger/details/' + user_id);
                }
            });
        }

    });
    // console.log(ledgerQuery, updateBalance);

}

module.exports = router;