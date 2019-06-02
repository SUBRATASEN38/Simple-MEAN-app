const MongoClient = require('mongodb').MongoClient;
const uri = "Enter MongoDB URL (Local/Global)";
const client = new MongoClient(uri, { useNewUrlParser: true });
const connection = new Promise(function (resolve, reject) {
    client.connect((err, dbo) => {
        if (err) {
            reject('err')
        } else {
            resolve(dbo);
        }
    });
});

module.exports = connection;