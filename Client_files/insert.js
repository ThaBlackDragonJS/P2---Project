
/*https://www.w3schools.com/nodejs/nodejs_mysql_insert.asp*/

let connect_mysql = require("./connect_mysql");
let con = connect_mysql.connect();

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  //Inserts Email and Password into Account Table in Database mydb
  var email = "test";
  var hashedPassword = "connected lines rgb(255, 52, 52) circle 1 1 object 0 circle 1 2 object 0 circle 1 3 object 0 circle 2 3 object 0 circle 3 3 object 0 circle 3 2 object 0 circle 3 1 object 0 circle 2 1 object 0 circle 1 1 object 0 ";
  var sql = "INSERT INTO Account (Email, Password) VALUES ?";
  var values = [[email,hashedPassword]];
  con.query(sql, [values],function (err, result) {
    //Throws if the length of the inputted strings are too long.
	//512 for Email and 264 for Password
	if (err) throw err; 
    console.log("1 record inserted");
  });
});