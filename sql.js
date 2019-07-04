const mysql = require('mysql');
const config = require("./botconfig.json");
const { host, user, database } = config.database;

let connection;

function handleDisconnect() {
  connection = mysql.createConnection({ host, user, database });

  connection.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
    console.log('MySQL Connected!')
  });
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports=connection;