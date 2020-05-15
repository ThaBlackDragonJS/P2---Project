//some code via IWP, https://gist.github.com/Jalalhejazi/5434727 and https://stackoverflow.com/questions/6396101/pure-javascript-send-post-data-without-a-form
const {createServer} = require("http");
const fs = require('fs');

//local files
const account_list = require("./account_list");
//const accounts_table = require("./accounts_table");
const check_credentials = require("./check_credentials");
const cluster = require("./cluster");
const delete_account = require("./delete_account");
const AesCtr = require("./aes");

//the encryption password for AES
const encryptionPassword = "testpassword"


//other values
let body = '';
//a prime number halfway between two powers of 2 - should be good for hashing
//used for assigning an ID to users, however, the implementation has not been entirely completed.
//currently, different users can get the same ID, since the re-index function has not been used.
const maxID = 7069;


let server = createServer((request, response) => {
  //send the HTML file, and other files required for it
  if(request.method == "GET") {
    switch(request.url) {
      //---------------------------Index section + email-------------------------------
      case "/":
        response.writeHead(200, {"Content-Type": "text/html"});
        fs.readFile('index.html', function(err, content){
          response.write(content);
          response.end();
        });
        break;
      case "/index.css":
        response.writeHead(200, {"Content-Type": "text/css"});
        fs.readFile('index.css', function(err, content){
          response.write(content);
          response.end();
        });
        break;
      //-----------------------------Login: Password section-------------------------
      case "/loginPassword": 
        response.writeHead(200, {"Content-Type": "text/html"});
        fs.readFile('loginPassword.html', function(err, content){
          response.write(content);
          response.end();
        });
        break;
      //-----------------------------Sign up: Password section------------------------------
      case "/signUpPassword":
        response.writeHead(200, {"content-type": "text/html"});
        fs.readFile("signUpPassword.html", function(err, content){
          response.write(content);
          response.end();
        });
        break;
      //----------------------------password input---------------------------
      case "/password.css":
        response.writeHead(200, {"Content-Type": "text/css"})
        fs.readFile('password.css', function(err, content){
          response.write(content);
          response.end();
        });
        break;
      case "/password.js":
        response.writeHead(200, {"Content-Type": "text/js"});
        fs.readFile('password.js', function(err, content){
          response.write(content);
          response.end();
        });
        break;
      case "/resetArrow.png":
        response.writeHead(200, {"Content-Type": "image/png"});
        fs.readFile('resetArrow.png', function(err, content){
          response.write(content);
          response.end();
        });
        break;
      case "/undoArrow.png":
        response.writeHead(200, {"Content-Type": "image/png"});
        fs.readFile('undoArrow.png', function(err, content){
          response.write(content);
          response.end();
        });
        break;
      //-----------------------------Misc---------------------------------
      case "/getPassword":
        response.writeHead(200);
        response.write(encryptionPassword);
        response.end();
        break;
      case "/aes.js":
        response.writeHead(200, {"Content-Type": "text/js"});
        fs.readFile('aes.js', function(err, content){
          response.write(content);
          response.end();
        });
        break;
      //--------------Default case----------------
      default:
        response.writeHead(404);
        response.write("Error: wrong url");
        console.log("Error: GET wrong url: " + request.url);
        response.end();
        break;
    }
  } else if (request.method == "POST") {
    //console.log('POST');
    switch(request.url) {
      //------------------------Index / email part--------------------------
      case "/": 
        body = '';
        //loads data
        request.on('data', function(data) {
          body += data;
          //console.log('Partial body: ' + body);
        });
        //does things with the recieved data
        request.on('end', function() {
          //console.log('Body: ' + body);
          //writes back an answer
          response.writeHead(200, {'Content-Type': 'text/html'});
          //split into the start info ("sign in " / "sign up ") and email info
          let requestStartInfo = "";
          let requestEmail = "";
          let i = 0;
          for(i; i < 8; ++i) {
            requestStartInfo += body[i];
          } //i is now 8
          for(i; i < body.length; ++i) {
            requestEmail += body[i];
          }
          //check if the encrypted email is in the database
          const origEmail = AesCtr.decrypt(requestEmail, encryptionPassword, 256);
          let emailExists;
          check_credentials.email_check(origEmail, callback_email_function);
          function callback_email_function(emailExistsOrNot) {
            //console.log("called back");
            emailExists = emailExistsOrNot;
            //console.log("email: " + origEmail);
            //console.log("email exists: " + emailExists);
            //console.log("sign in or up:  " + requestStartInfo);
            if(requestStartInfo == "sign in ") {
              //if it is in the database: give back "success", else "failure"
              if(emailExists) {
                response.write("success");
              }else {
                response.write("failure");
              }
            } else if(requestStartInfo == "sign up ") {
              //in the database = "failure", else "success"
              if(emailExists) {
                response.write("failure");
              }else {
                response.write("success");
              }
            }
            response.end();
          }
        });
        break;
      //-----------------------------login: password part-------------------------------
      case "/loginPassword":
        body = '';
        //loads data
        request.on('data', function(data) {
          body += data;
          //console.log('Partial body: ' + body);
        });
        request.on("end", function() {
          //here, the data contains the encrypted email and password
          //first split it into email and password
          let encryptedEmail = "",
              encryptedPassword = "";
          let i = 0;

          //the first space separates the email from the password
          while(body[i] != " ") {
            encryptedEmail += body[i];
            ++i;
          } //i is now at the space
          ++i;
          //continue until there's no more data
          for(i; i < body.length; ++i) {
            encryptedPassword += body[i];
          }

          const origEmail = AesCtr.decrypt(encryptedEmail, encryptionPassword, 256);
          const origPassword = AesCtr.decrypt(encryptedPassword, encryptionPassword, 256);
          const hashedPassword = cluster.call_sha256(origPassword);
          //console.log("email: " + origEmail);
          //console.log("password: " + origPassword);
          //writes back an answer
          response.writeHead(200, {'Content-Type': 'text/html'});
          //check if the encrypted email is in the database
          let loginCorrect = check_credentials.login_check(origEmail, hashedPassword, callback_login_function);
          function callback_login_function(loginCorrect) {
            if(loginCorrect) {
              response.write("success");
            }else {
              response.write("failure");
            }
            response.end();
          }
        });
        break;
      //---------------------------Signup: password part----------------------
      case "/signUpPassword":
        body = '';
        //loads data
        request.on('data', function(data) {
          body += data;
          //console.log('Partial body: ' + body);
        });
        request.on("end", function() {
          //here, the data contains the encrypted email and password
          //first split it into email and password
          let encryptedEmail = "",
              encryptedPassword = "";
          let i = 0;

          //the first space separates the email from the password
          while(body[i] != " ") {
            encryptedEmail += body[i];
            ++i;
          } //i is now at the space
          ++i;
          //continue until there's no more data
          for(i; i < body.length; ++i) {
            encryptedPassword += body[i];
          }
          //decrypt
          const origEmail = AesCtr.decrypt(encryptedEmail, encryptionPassword, 256);
          const origPassword = AesCtr.decrypt(encryptedPassword, encryptionPassword, 256); //needs to be hashed later
          const hashedPassword = cluster.call_sha256(origPassword);

          //save the user in database
          let userID = cluster.hash_function(origEmail, maxID);
          cluster.register_account(origEmail, hashedPassword, userID, callback_sign_up_function);
          
          //give back answer
          response.writeHead(200, {'Content-Type': 'text/html'});
          function callback_sign_up_function(signUpSuccess) {
            if(signUpSuccess) {
              console.log("user signed up");
              response.write("success");
            }else {
              console.log("signup failed");
              response.write("failure");
            }
            response.end();
          }
        });
        break;
      //------------------------------misc------------------------------
      default:
        console.log("Error: POST wrong url");
        console.log(request.url);
        break;
    }
  }
});
//this works, as an example:    dbConnect.create_database();

server.listen(8000);
console.log("Listening! (port 8000)");


//TODO:
//Client side:
//-send data to server
//-connect various menus (main/signup/login and within signup and login, email/password/"SUCCESS"/"ERROR" pages)
//-use tostring and encryption

//Server side:
//-accept data from Client
//-handle it according to which menu they claim to be in
//-make password_string_to_array function
//  -use in conjunction with decryption
//    -make decryption function (ask Silas)











