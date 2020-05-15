const connect_mysql = require("./connect_mysql");
let con = connect_mysql.connect();

//function myscript(){
var x=0;
x = con;

console.log("After Connect");
console.log(x);
console.log(x.config.database);
var new_database = x.config.database;

//Makes sure the database is undefined, if database is not created, so that require("mysql").createConnection does not throw error.
x.config.database = undefined;

//Used for checking if config.database is set as undefined if it does not exist.
//Secure non-existing.
console.log(new_database);
console.log(x.config.database);
console.log(x);
x.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
	//Creates Database "mydb" 
    x.query("CREATE DATABASE ??", new_database , function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});

//}
//Check if database is already defined and created, don't run this script. too avoid crash.


