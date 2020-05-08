//https://www.npmjs.com/package/crypto-js
//https://cryptojs.gitbook.io/docs/
//https://code.google.com/archive/p/crypto-js/

//teststring
//var testString = "rfajewriofjwaoigfejb ioergniggdyeiuafreygiueraybiuerayrteaiubyer";

//password is to be requested from another place (sign up / loggin?)
function encrypt_string(input, password){ 

  //request installed npm package
  let CryptoJS = require("crypto-js");

  //input != string error handling
  if (typeof input != "string"){
    console.log("encrypt_string - error: input is not a string");
    return;
  }

  //encrypting function
  let ciphertext = CryptoJS.AES.encrypt(input, password).toString();

  //returns encrypted string
  return ciphertext;
}

//Decrypting function
  //var bytes  = CryptoJS.AES.decrypt(ciphertext, password);
  //var originalText = bytes.toString(CryptoJS.enc.Utf8);