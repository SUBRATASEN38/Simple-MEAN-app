const Rx = require('rxjs');
const db = require('./connect');
let db_status = new Rx.BehaviorSubject(null);
let database_value;

const conectDB = () => {
    db.then((value) => {
        database_value = value;
        db_status.next(database_value);
    }).catch((err) => console.log(err));
}

module.exports = { db_status, conectDB, database_value };