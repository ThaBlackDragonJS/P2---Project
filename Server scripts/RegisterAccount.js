/*https://www.w3schools.com/nodejs/nodejs_mysql_insert.asp*/
function RegisterAccount(encryptedEmail,hashedPassword, hash){
	var mysql = require('mysql');

	var con = mysql.createConnection({
		host: "ThaBlackDragonJS", 	//["Hostname"] 
		user: "test", 				//["username used for connecting to the database"]
		password: "GroupC1-7", 		//["Password used for connecting to the database"]
		database: "mydb" 			//["Name of the Database", which is "mydb" if db_connection is used]
	});

	con.connect(function(err) {
	if (err) throw err;
		console.log("Connected!");
		con.query("SELECT Email FROM Account WHERE Email = ?", encryptedEmail , function (err, result, fields) {
    if (err) throw err;
		console.log(result.length);
			if (result.length > 0){
				console.log("Account already exists");
				//Return Error message.
			}else{
				insert(encryptedEmail, hashedPassword, hash);
			}
	});
});

function insert(encryptedEmail, hashedPassword, hash){
	//Inserts Email and Password into Account Table in Database mydb
	var sql = "INSERT INTO Account (Email, Password, HashID) VALUES ?";
	var values = [[encryptedEmail,hashedPassword,hash]];
	con.query(sql,[values], function (err, result) {
		//Throws if the length of the inputted strings are too long.
		//512 for Email and 264 for Password
		if (err) throw err; 
		console.log("Number of records inserted: " + result.affectedRows);
		});
	};
};
