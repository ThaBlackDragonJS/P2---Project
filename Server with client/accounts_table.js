
/*https://www.w3schools.com/nodejs/nodejs_mysql_create_table.asp*/

let connect_mysql = require("./connect_mysql");
let con = connect_mysql.connect();

con.connect(function(err) {
  console.log("test");
  if (err) throw err;
  console.log("Connected!");
  //Creates table Account in mydb.
  //rename Account to accountTable everywhere.
  var sql = "CREATE TABLE Account (id INT AUTO_INCREMENT PRIMARY KEY, Email VARCHAR(576), Password VARCHAR(1000), HashID VARCHAR(727))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});