/* Credential Checker */

//Potentially remove fields from line 14-ish & 18-ish


//Potentially remove fields from line 14-ish & 18-ish
exports.login_check = function(encryptedEmail, encryptedPassword, callback) {
	//console.log("email: " + encryptedEmail);
	//console.log("password: " + encryptedPassword);
	const connect_mysql = require("./connect_mysql");
	let con = connect_mysql.connect();
	con.connect(function(err) {
		if (err) {throw err};
		//console.log("Connected!");
		con.query("SELECT Email FROM Account WHERE Email = ?", encryptedEmail , function (err, result, fields) {
			if (err) {throw err};
			//console.log(result.length);
			if (result.length > 0){
				con.query("SELECT Password FROM Account WHERE Password = ?", encryptedPassword , function (err, result, fields) {
					if(result.length > 0){
						console.log("Login was successful - return login validation command");
						callback(1);
					}else{
						console.log("Password is wrong failmessage"); 
						callback(0);
					}
				});
			}else {
				console.log("Email does not exist - return wrong email infomation");
				callback(0);
			}
		});
	});
}

exports.email_check = function(email, callback) {
	const connect_mysql = require("./connect_mysql");
	let con = connect_mysql.connect();
	con.connect(function(err) {
		if (err) {throw err};
		//console.log("Connected!");
		con.query("SELECT Email FROM Account WHERE Email = ?", email , function (err, result, fields) {
			if (err) {throw err};
			//console.log(result.length);
			if (result.length > 0){
				//console.log("Email exists - successful login?");
				callback(1);
			}else {
				//console.log("Email does not exist - return wrong email infomation");
				callback(0);
			}
		});
	});
}