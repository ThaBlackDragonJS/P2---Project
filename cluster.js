/*
var Email = "test@testemail.test"; 
var Password = "testpassword"; 
var max = 727;

console.log("E-mail at start:   " + Email);
console.log("Password at start: " + Password);

var Email = password_hash(Email);
var EmailID = hash_function(Email, max);
var Password = password_hash(Password);

	//-Hash Email. - Encrypt instead... 
register_account(Email ,Password, EmailID);

console.log("E-mail after hashing:  " + Email);
console.log("Password after hashing:" + Password);
console.log("Email ID is now:       " + EmailID);

*/
function hash_function(email, max){
  let charCodeArray = [];
  let i = 0, 
      j = 0, 
      emailNumber = 0,
      hashNumber = 0;

  //Checks the correctness of the input
  if (typeof email != "string" || typeof max != "number"){
    console.log("hash_function - error: email not a string and/or max not a number");
    return; 
  } 

  if (max > Math.pow(10, 150)){
    console.log("hash_function - error: max is too large");
    return; 
  } 
  if (email.length > 576){
    console.log("hash_function - error: email too long");
    return; 
  } 

  //Converts the email into an array of numbers.
  for (i = 0; i < email.length; i++){
    charCodeArray[i] = email.charCodeAt(i);
  }

  //Converts the array of number into a number 
  //Avoids collision by the equivalent to bit-shifting
  //Avoids too large numbers by limiting the exponent to 100
  for (i = 0; i < email.length; i++){
    if (i > 100){
      j = 100;
    } else{
      j = i;
    }
    emailNumber += charCodeArray[i] * Math.pow(256, j);
    emailNumber = emailNumber % max;
  }

  //Modular exponentiation for hashing
  hashNumber = 1;
  for (i = 0; i < charCodeArray[0] + 10; i++){
    hashNumber *= emailNumber;
    hashNumber = hashNumber % max;
  }
	console.log(hashNumber + "Hashnumber");
  return hashNumber;
}

function password_hash(password){
  let i = 0;

	//Error handling for password type
  if(typeof password != "string"){
		console.log("Password_hash - error: Password not a string");
    return; 
	}

	//Error handling for password length
  if(password.length > 100){
    console.log("Password_hash - error: Password too long.");
    return;
  }

	//Error handling for non ascii characters
	for(i = 0; i < password.length; i++){
		if(password.charCodeAt(i) > 255){
			console.log("Password_hash - error: Password contains non ascii characters.");
      return;
		}
  }

  console.log(password + "Efter Sha256");
  return(sha256(password));
};

//SHA-256 hashing function
//Borrowed the SHA-256 function from https://geraintluff.github.io/sha256/ Created by geraintluff

function sha256(ascii) {
	
	function rightRotate(value, amount) {
		return (value>>>amount) | (value<<(32 - amount));
	};
	
	var mathPow = Math.pow;
	var maxWord = mathPow(2, 32);
	var lengthProperty = 'length'
	var i, j; // Used as a counter across the whole file
	var result = ''

	var words = [];
	var asciiBitLength = ascii[lengthProperty]*8;
	
	//* caching results is optional - remove/add slash from front of this line to toggle
	// Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
	// (we actually calculate the first 64, but extra values are just ignored)
	var hash = sha256.h = sha256.h || [];
	// Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
	var k = sha256.k = sha256.k || [];
	var primeCounter = k[lengthProperty];
	/*/
	var hash = [], k = [];
	var primeCounter = 0;
	//*/

	var isComposite = {};
	for (var candidate = 2; primeCounter < 64; candidate++) {
		if (!isComposite[candidate]) {
			for (i = 0; i < 313; i += candidate) {
				isComposite[i] = candidate;
			}
			hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
			k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
		}
	}
	
	ascii += '\x80' // Append Ƈ' bit (plus zero padding)
	while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
	for (i = 0; i < ascii[lengthProperty]; i++) {
		j = ascii.charCodeAt(i);
		if (j>>8) return; // ASCII check: only accept characters in range 0-255
		words[i>>2] |= j << ((3 - i)%4)*8;
	}
	words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
	words[words[lengthProperty]] = (asciiBitLength)
	
	// process each chunk
	for (j = 0; j < words[lengthProperty];) {
		var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
		var oldHash = hash;
		// This is now the undefinedworking hash", often labelled as variables a...g
		// (we have to truncate as well, otherwise extra entries at the end accumulate
		hash = hash.slice(0, 8);
		
		for (i = 0; i < 64; i++) {
			var i2 = i + j;
			// Expand the message into 64 words
			// Used below if 
			var w15 = w[i - 15], w2 = w[i - 2];

			// Iterate
			var a = hash[0], e = hash[4];
			var temp1 = hash[7]
				+ (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
				+ ((e&hash[5])^((~e)&hash[6])) // ch
				+ k[i]
				// Expand the message schedule if needed
				+ (w[i] = (i < 16) ? w[i] : (
						w[i - 16]
						+ (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
						+ w[i - 7]
						+ (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
					)|0
				);
			// This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
			var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
				+ ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
			
			hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
			hash[4] = (hash[4] + temp1)|0;
		}
		
		for (i = 0; i < 8; i++) {
			hash[i] = (hash[i] + oldHash[i])|0;
		}
	}
	
	for (i = 0; i < 8; i++) {
		for (j = 3; j + 1; j--) {
			var b = (hash[i]>>(j*8))&255;
			result += ((b < 16) ? 0 : '') + b.toString(16);
		}
	}
	return result;
};


exports.register_account = function(encryptedEmail,hashedPassword, hash){

	const connect_mysql = require("./connect_mysql");
	let con = connect_mysql;

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
