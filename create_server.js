//some code via IWP, https://gist.github.com/Jalalhejazi/5434727 and https://stackoverflow.com/questions/6396101/pure-javascript-send-post-data-without-a-form
const {createServer} = require("http");
const fs = require('fs');

//local files
const account_list = require("./Server_files/account_list");
//const accounts_table = require("./accounts_table");
const check_credentials = require("./Server_files/check_credentials");
const cluster = require("./Server_files/cluster");
const delete_account = require("./Server_files/delete_account");
const AesCtr = require("./Server_files/aes");

//the encryption password for AES
const encryptionPassword = "testpassword"
const serverPort = 8000;


//other values
let body = '';
//maxID is a prime number halfway between two powers of 2 - should be good for hashing
//maxID is used for assigning an ID to users, however, the implementation has not been entirely completed.
//currently, different users can get the same ID, since the re-index function has not been used.
const maxID = 7069;
gridHeight = 5, gridWidth = gridHeight;


let server = createServer((request, response) => {
  //send the HTML file, and other files required for it
  if(request.method == "GET") { //-------------------------------------------------GET part-------------------------------------------------
    switch(request.url) {
      //---------------------------Index section + email-------------------------------
      case "/":
        response.writeHead(200, {"Content-Type": "text/html"});
        fs.readFile('./Client_files/index.html', function(err, content){
          response.write(content);
          response.end();
        });
        break;
      case "/index.css":
        response.writeHead(200, {"Content-Type": "text/css"});
        fs.readFile('./Client_files/index.css', function(err, content){
          response.write(content);
          response.end();
        });
        break;
      //-----------------------------Login: Password section-------------------------
      case "/loginPassword": 
        response.writeHead(200, {"Content-Type": "text/html"});
        fs.readFile('./Client_files/loginPassword.html', function(err, content){
          response.write(content);
          response.end();
        });
        break;
      //-----------------------------Sign up: Password section------------------------------
      case "/signUpPassword":
        response.writeHead(200, {"content-type": "text/html"});
        fs.readFile("./Client_files/signUpPassword.html", function(err, content){
          response.write(content);
          response.end();
        });
        break;
      //----------------------------password input, both login and signup---------------------------
      case "/password.css":
        response.writeHead(200, {"Content-Type": "text/css"})
        fs.readFile('./Client_files/password.css', function(err, content){
          response.write(content);
          response.end();
        });
        break;
      case "/password.js":
        response.writeHead(200, {"Content-Type": "text/js"});
        fs.readFile('./Client_files/password.js', function(err, content){
          response.write(content);
          response.end();
        });
        break;
      case "/resetArrow.png":
        response.writeHead(200, {"Content-Type": "image/png"});
        fs.readFile('./Client_files/resetArrow.png', function(err, content){
          response.write(content);
          response.end();
        });
        break;
      case "/undoArrow.png":
        response.writeHead(200, {"Content-Type": "image/png"});
        fs.readFile('./Client_files/undoArrow.png', function(err, content){
          response.write(content);
          response.end();
        });
        break;
      //-----------------------------encryption---------------------------------
      case "/getPassword":
        response.writeHead(200);
        response.write(encryptionPassword);
        response.end();
        break;
      case "/aes.js":
        response.writeHead(200, {"Content-Type": "text/js"});
        fs.readFile('./Server_files/aes.js', function(err, content){
          response.write(content);
          response.end();
        });
        break;
      //--------------Logged in page--------------
      case "/loggedIn":
        response.writeHead(200, {"content-type": "text/html"});
        fs.readFile("./Client_files/loggedIn.html", function(err, content){
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
  } else if (request.method == "POST") { //-------------------------------------------POST part-----------------------------------------------------
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

          //check password requirements and validates email form
          let passwordArray = password_string_to_array(origPassword);
          if(requirement_checker(passwordArray, passwordArray.length, gridWidth, gridHeight) != 1
             || validateEmail(origEmail) == false) {
            response.writeHead(200);
            response.write("failure");
            response.end();
          } else { //only save the user if the password is within requirements
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
          }
        });
        break;
      //------------------------------default case------------------------------
      default:
        console.log("Error: POST wrong url " + request.url);
        break;
    }
  }
});
//this works, as an example:    dbConnect.create_database();

server.listen(serverPort);
console.log("Listening! (port " + serverPort + ")");












function password_string_to_array(passwordString) {
  let passwordArray = [];
  let charsRead = 0, //keeps track of how much of the passwordString has been read
      objectsRead = 0,
      IDsRead = 0;
  let i = 0;

  //the length of the names of each type of object
  let pointLength = 5,
      arrowLength = 5,
      connectedLength = 15;

  //the length of a string containing an RGB colour
  let colourLength = 16;

  //the length of an id for an object
  let idLength = 19,
      arrowStartEndIDLength = 10;

  while(charsRead < passwordString.length) {
    //first split into cases point / arrow / connected lines
    if(passwordString[charsRead] == "p") { //-----Point
      //-------read a point
      passwordArray[objectsRead] = [];
      //read the type ("point ")
      passwordArray[objectsRead].type = read_chars(passwordString, charsRead, pointLength);
      charsRead += pointLength + 1; //the "+ 1" makes it ignore the space in "point "
      //read the colour
      passwordArray[objectsRead].colour = read_chars(passwordString, charsRead, colourLength);
      charsRead += colourLength + 1;
      //read the id
      passwordArray[objectsRead].id = read_chars(passwordString, charsRead, idLength);
      charsRead += idLength + 1;
      //point fully read
      ++objectsRead;
    }else if(passwordString[charsRead] == "a") { //------Arrow
      //-------read an arrow
      passwordArray[objectsRead] = [];
      //read the type ("arrow ")
      passwordArray[objectsRead].type = read_chars(passwordString, charsRead, arrowLength);
      charsRead += arrowLength + 1; //the "+ 1" makes it ignore the space in "arrow "
      //read the colour
      passwordArray[objectsRead].colour = read_chars(passwordString, charsRead, colourLength);
      charsRead += colourLength + 1;
      //read the id
      passwordArray[objectsRead].id = read_chars(passwordString, charsRead, idLength);
      charsRead += idLength + 1;
      //read the start and end IDs
      passwordArray[objectsRead].idStart = read_chars(passwordString, charsRead, arrowStartEndIDLength);
      charsRead += arrowStartEndIDLength + 1;
      passwordArray[objectsRead].idEnd = read_chars(passwordString, charsRead, arrowStartEndIDLength);
      charsRead += arrowStartEndIDLength + 1;
      //arrow fully read
      ++objectsRead;
    }else if(passwordString[charsRead] == "c") { //------Connected lines
      //-------read a "connected lines"
      let continueExpression = true; //for the while loop
      passwordArray[objectsRead] = [];

      //read the type ("connected lines ")
      passwordArray[objectsRead].type = read_chars(passwordString, charsRead, connectedLength);
      charsRead += connectedLength + 1; //the "+ 1" makes it ignore the second space in "connected lines "
      //read the colour
      passwordArray[objectsRead].colour = read_chars(passwordString, charsRead, colourLength);
      charsRead += colourLength + 1;
      //read the IDs
      passwordArray[objectsRead].IDs = [];
      IDsRead = 0;
      while(continueExpression) {
        //read an ID
        passwordArray[objectsRead].IDs[IDsRead] = read_chars(passwordString, charsRead, idLength);
        charsRead += idLength + 1;
        ++IDsRead;
        //find out if there isn't another ID to read
        //only "circle ..." has "i" as the 2nd letter
        if(passwordString[charsRead + 1] != "i") {
          continueExpression = false;
          ++objectsRead;
        }
      }
    }else {
      console.log("password_string_to_array - error while reading string")
      ++charsRead;
    }
  }
  return passwordArray;
}

function read_chars(readFrom, skipAmount, readAmount) {
  let i = 0;
  let Body = "";
  for(i; i < readAmount; ++i) {
    Body += readFrom[skipAmount + i];
  }
  return Body;
}





//----------------------------------------------requirement_checker.js----------------------------------------------
//checks if the password is within the password minimum requirements
//
//requirements:
// -at least 2 colours used
// -at least 10 unique nodes used
//
//input: passwordData array + passwordObjects
//output: "boolean" 1/0 (yes/no) ("is it within requirements?")
function requirement_checker(passwordData, passwordObjects, gridWidth, gridHeight) {
            //used   R  G  B   "boolean" values
  let coloursUsed = [0, 0, 0],
      uniqueNodesUsed = [], //used coordinates, again "boolean" values
      uniqueNodesUsedCounter = 0;
  let i = 0, j = 0;
  let tempX = 0, tempY = 0;

  //input error handling
  if(typeof gridHeight != "number" || typeof gridWidth != "number") {
    console.log("requirement_checker - error: gridHeight and/or gridWidth not a number")
    return;
  }
  if(typeof passwordObjects != "number") {
    console.log("requirement_checker - error: passwordObjects not a number")
    return;
  }
  if(passwordObjects == 0) {
    return 0; //not within requirements
  } else if (passwordObjects < 0) {
    console.log("requirement_checker - error: passwordObjects less than 0")
    return;
  }


  //finds colours used
  for(i = 0; i < passwordObjects; ++i) {
    if(passwordData[i].colour == "rgb(255, 52, 52)") {
      coloursUsed[0] = 1;
    } else if (passwordData[i].colour == "rgb(129,225,129)") {
      coloursUsed[1] = 1;
    } else if (passwordData[i].colour == "rgb( 24, 24,255)") {
      coloursUsed[2] = 1;
    } else {
      console.log("requirement_checker - error: wrong colour");
    }
  }
  //checks colours used
  if(coloursUsed[0] + coloursUsed[1] + coloursUsed[2] < 2) {
    //console.log("fail: colours used is " + (coloursUsed[0] + coloursUsed[1] + coloursUsed[2]));
    return 0; //not within requirements
  }

  //makes uniqueNodesUsed into a 2D array and sets everything to 0
  for(i = 0; i < gridHeight; ++i) {
    uniqueNodesUsed[i] = [];
    //set all indexes to 0
    for(j = 0; j < gridWidth; ++j){
      uniqueNodesUsed[i][j] = 0;
    }
  }
  //finds unique nodes used
  for(i = 0; i < passwordObjects; ++i) {
    //separate into cases point / arrow / connected lines
    if(passwordData[i].type == "point") {
      tempX = passwordData[i].id[7];
      tempY = passwordData[i].id[9];
      uniqueNodesUsed[tempX][tempY] = 1;
    } else if(passwordData[i].type == "arrow") {
      tempX = passwordData[i].idStart[7];
      tempY = passwordData[i].idStart[9];
      uniqueNodesUsed[tempX][tempY] = 1;
      tempX = passwordData[i].idEnd[7];
      tempY = passwordData[i].idEnd[9];
      uniqueNodesUsed[tempX][tempY] = 1;
    } else if(passwordData[i].type == "connected lines") {
      for(j = 0; j < passwordData[i].IDs.length; ++j) {
        tempX = passwordData[i].IDs[j][7];
        tempY = passwordData[i].IDs[j][9];
        uniqueNodesUsed[tempX][tempY] = 1;
      }
    } else {
      console.log("requirement_checker - error: wrong password object type");
    }
  }

  //checks unique nodes used
  for(i = 0; i < gridHeight; ++i) {
    for(j = 0; j < gridWidth; ++j){
      uniqueNodesUsedCounter += uniqueNodesUsed[i][j];
    }
  }
  if(uniqueNodesUsedCounter < 10) {
    //console.log("fail: nodes used is " + uniqueNodesUsedCounter);
    return 0; //not within requirements
  }
  return 1; //within requirements
}





//email format validation, from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}