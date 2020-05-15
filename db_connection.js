
/*https://www.w3schools.com/nodejs/nodejs_mysql_create_db.asp*/

exports.create_database = function (){
  var mysql = require('mysql');

  var con = mysql.createConnection({
    host: "DESKTOP-7A8B02S", //["Hostname"] 
    user: "doh007", //["username used for connecting to the database"]
    password: "abcdefg54321", //["Password used for connecting to the database"]
  });


  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    //Creates Database "mydb"
      con.query("CREATE DATABASE mydbtest", function (err, result) {
      if (err) throw err;
      console.log("Database created");
    });
  });
}
