------Authenticator------
This program is an authenticator in which the user is able to draw a password using iconography, 
with the purpose of increasing memorability while not decreasing the security thereof. 
The program is a product from a second semester project on Computer Science at AAU (Aalborg University) in which the theme "Authentication" was chosen. 

This file explains how to setup a local server as well as describing the folder/file structure and some of the settings available.

Important note: The web-application only works on the browser Google Chrome.

Settings in Server_files/create_server.js:
-The encryption password is on line 14
-The port which the server is hosted on is on line 15
-maximum user ID (line 23)

Settings in Server_files/accounts_table.js:
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





Directories and files:
-create_server.js  //used for starting the server
-Client_files
  -index.html      //webpage index + email input
  -common
    -other webpages used
  -CSS
    -styling for index & password input
  -images
    -all png's for webpage
  -JS
    -password.js   //used for both login & signup, for password part

-Server_files
  -additional files the server needs to function
  -database modules






