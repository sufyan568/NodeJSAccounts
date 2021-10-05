const e = require("express");
var db = require('../model/db');
var router = e.Router();
const readXlsxFile = require('read-excel-file/node');
const xlsx =require('node-xlsx');
const fs =require('fs');
//Insertion create page
router.get('/create', (req, res) => {
    // res.json(['importer'])
    res.render("importer/import", {
        viewTitle: "User Record File Import",
    });
});
// Insertion create page
router.post('/store', (req, res) => {
    // importFile(req, res);
    console.log(req.body);
});
function importFile(req, res) {
  console.log(req);
    readXlsxFile(fs.createReadStream(req.body.fileimport)).then((rows) => {
            dd(rows);
      });
}

module.exports = router;