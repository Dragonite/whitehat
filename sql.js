const mysql = require('mysql');
const config = require("./botconfig.json");
const { host, user, password, database } = config.database;

let pool = mysql.createPool({ host, user, password, database });

module.exports = pool;