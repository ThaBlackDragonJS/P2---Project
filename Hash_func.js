//input: email (string) + max output size (database array length)
//output: array index "suggestion" for the given email
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
      j = i
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

  return hashNumber;
}
