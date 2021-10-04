const e = require("express");
var db = require('../model/db');
var router = e.Router();


//Insertion create page
router.get('/login', (req, res) => {
    res.render("admin/login", {
        viewTitle: "User Login",
    });
});
//Insertion create page
router.post('/login', (req, res) => {
    adminLogin(req, res);
});
function adminLogin(req, res) {
    let errors = [];
    const { email, password } = req.body;
    if (!email || !password) {
        error.push({ msg: 'Please fill all fields' });
    }
    var user = "SELECT *  FROM `users` WHERE `email` = '" + email + "' AND `password` = " + password;
    db.query(user, (err, data, fields) => {
        if (err) throw err;

        else if ((typeof data[0] !== "undefined") && (data[0].hasOwnProperty('email')) && (data[0].hasOwnProperty('password'))) {
            if (data[0].role == 'Admin') {
                res.redirect('../user/index');
            }
            else if (data[0].role == 'User') {
                res.redirect('../ledger/details/' + data[0].id);
            }

        }
        else {
            res.render("admin/login", {
                viewTitle: "User Login",
                EamilPassword: 'Your Email & Password is not match!',
            });
            //     res.redirect('./login',{ msg: 'Your Email & Password is not match!' });
        }
    });
}

module.exports = router;