
/*https://www.w3schools.com/nodejs/nodejs_mysql_delete.asp*/

const connect_mysql = require("./connect_mysql");
let con = connect_mysql;

con.connect(function(err) {
  if (err) throw err;
  //Removes the Account dependent on the Email used for requesting account delete
  var sql = "DELETE FROM Account WHERE Email = ?";
  //Potentially add fields variable and run field loop for deletion of records related to the email.
  con.query(sql, encryptedEmail, function (err, result){
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });
});

//con.query("SELECT Email FROM Account WHERE Email = ?", encryptedEmail , function (err, result, fields)