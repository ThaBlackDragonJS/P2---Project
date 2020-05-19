const connect_mysql = require("./connect_mysql");
let con = connect_mysql;

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM Account", function (err, result, fields) {
    if (err) throw err;
    console.log("account_list result:" + result);
  });
});