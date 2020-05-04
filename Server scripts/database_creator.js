/*var mysql = require('mysql');

var con = mysql.createConnection({
  host: "ThaBlackDragonJS", //["Hostname"] 
  user: "test", //["username used for connecting to the database"]
  password: "GroupC1-7", //["Password used for connecting to the database"]
  database: "mydb" //["Name of the Database", which is "mydb" if db_connection is used]
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  console.log(con);
  console.log(con.config.database);
  con.config.database = undefined ;
  console.log(con.config.database);
});
*/
var x=0;
x = connecter(x);
console.log("After Connect");
//console.log(x);
console.log(x.config.database);
var new_database = x.config.database;

x.config.database = undefined;
//Used for checking if config.database is set as undefined if it does not exist.
//Secure non-existing.
//console.log(new_database);
//console.log(x.config.database);
//console.log(x);
x.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
	//Creates Database "mydb" 
    x.query("CREATE DATABASE ??", new_database , function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});

function connecter(con){
    var mysql = require("mysql");
    var con = mysql.createConnection({
        host: "ThaBlackDragonJS",     //["Hostname"] 
        user: "test", 		//["Username used for connecting to the database"]
        password: "GroupC1-7", 	//["Password used for connecting to the database"]
        database: "mydb" 		//["Name of the Database", which is "mydb" if db_connection is used] -- Change to function for created Database.
    });
	console.log(con);
    return(con);
}



