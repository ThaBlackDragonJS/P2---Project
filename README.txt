Settings in create_server.js:
-The encryption password is on line 14
-The port which the server is hosted on is on line 15
-maximum user ID (line 23)

Settings in accounts_table.js:
-max email length
  -default 320, since that's the longest email possible (https://www.rfc-editor.org/errata_search.php?rfc=3696)
-max hashed password length
  -default 128, to support AES512 in case of future upgrade
-max hashID length
  -default 4, since maxID is set to 7069 (in create_server.js:23)



Requirements for this server:
-NodeJS needs to be installed
-npm libraries required: "http", "mysql", "fs"
-MySQL needs to be installed and running (https://www.mysql.com/)
-you need to be logged into MySQL

Initial setup of server:
-edit connect_mysql.js to have the correct host, user, password and database
  -The host is stated in MySQL under "Server Status"
  -The user and password is your MySQL username and password (does not need to be root user)
  -The database is the name given to the database - can be given any name
-run database_creator.js (creates a MySQL database)
-run accounts_table.js (sets specifications for the database)

Starting the server:
-run create_server.js




Files:
-HTML, CSS and PNG files are for the client
-password.js is also for the client
-The rest of the JS files are for the server