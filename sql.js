const mysql = require('mysql');
const config = require("./botconfig.json");
const { host, user, database } = config.database;

let connection = mysql.createConnection({ host, user, database });

connection.connect(function (err) {
  if (err) {
    throw err;
  };
  console.log("MySQL Connected!");
});

module.exports=connection;