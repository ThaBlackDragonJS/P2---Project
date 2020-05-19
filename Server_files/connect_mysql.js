//connects js to mysql
exports.connect = function() {
  let mysql = require("mysql");

  let con = mysql.createConnection({
    host: "DESKTOP-7A8B02S", //["Hostname"] 
    user: "doh007", 			//["Username used for connecting to the database"]
    password: "abcdefg54321",
    database: "mydbtest4" 			//["Name of the Database", which is "mydb" if db_connection is used]
  });
  return con;
}