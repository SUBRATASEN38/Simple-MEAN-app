var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

const database = require('../db-connect/database');
/* GET home page. */
let db;
database.db_status.subscribe(client => {
  if (client !== null) {
    db = client.db('test-db');
  }
});

router.get('/', function (req, res) {
  if (db !== undefined) {
    db.collection("sample").find({}).sort({ "time_stamp": 1 }).toArray(function (err, result) {
      res.send({ response: { status: 200, msg: "Fetched Successfully", result: result } });
    });
  }
});


router.post('/add-data', function (req, res) {
  let data = { ...req.body, ...{ time_stamp: Date.now() } };
  db.collection("sample").insertOne(data, function (err, result) {
    if (!err) res.send(({ response: { status: 200, msg: "Updated Successfully", result: result.ops } }));
  });
});

router.post('/update-data', (req, res) => {
  let id = req.body.id;
  delete req.body["id"];
  db.collection("sample").updateOne(
    { "_id": ObjectID(`${id}`) },
    { $set: { ...req.body, ...{ time_stamp: Date.now() } } }, (err, response) => {
      if (!err) {
        db.collection("sample").find({ "_id": ObjectID(`${id}`) }).toArray(function (err, result) {
          console.log(result);
          res.send({ response: { status: 200, msg: "Updated Successfully", result: result } });
        });
      }
    }
  );
});


router.post('/remove-data', (req, res) => {
  let id = req.body.id;
  db.collection("sample").deleteOne(
    { "_id": ObjectID(`${id}`) }, (err, response) => {
      if (!err) {
        res.send({ response: { status: 200, msg: "Deleted Successfully" } });
      }
    }
  );
});
module.exports = router;
