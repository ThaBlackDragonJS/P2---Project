
//input: email (string) + max output size (database array length)
//output: array index "suggestion" for the given email
function Rehash_function(hashnum, max){
    let hashnumArray = [];
    let i = 0, 
        j = 0, 
        hashNumber = 0,
        Rehashednum = 0;
  
    //Checks the correctness of the input
    if (typeof hashnum != "number" || typeof max != "number"){
      console.log("Rehash_function - error: Hashnum not a number and/or max not a number");
      return; 
    } 
  
    if (max > Math.pow(10, 150)){
      console.log("Rehash_function - error: max is too large");
      return; 
    } 
    if (hashnum.length > 576){
      console.log("Rehash_function - error: hash too long");
      return; 
    } 
    //Converts the hash into an array of numbers to be hashed again.
      for (i = 0; i < hashnumArray.length; i++){
        Rehashednum = hashnumArray[i];
      }
    //Converts the array of number into a number 
    //Avoids collision by the equivalent to bit-shifting
    //Avoids too large numbers by limiting the exponent to 100
    for (i = 0; i < hashnum.length; i++){
      if (i > 100){
        j = 100;
      } else{
        j = i
      }
      hashNumber += hashnumArray[i] * Math.pow(256, j);
      hashNumber = hashNumber % max;
    }
  
    //Modular exponentiation for hashing
    Rehashednum = 1;
    for (i = 0; i < hashnumArray[0] + 10; i++){
      Rehashednum *= emailNumber;
      Rehashednum = Rehashednum % max;
    }
  
    return Rehashednum;
  }