function password_to_string(password) {
  let outputString = "";
  let i = 0, j = 0;
  //Checks the correctness of the input
  if (isArray(password) != true) {
    console.log("password_to_string - error: password not an array");
    return;
  }
  //goes through all objects in the password
  for(i = 0; i < password.length; ++i) {
    //splits into cases point / arrow / connected lines
    //always first adds the type, to make it easier to convert back into an array
    outputString += password[i].type + " ";
    //then always adds the colour, since every object has exactly 1 "colour" property
    outputString += password[i].colour + " ";
    if(password[i].type == "point") {
      outputString += password[i].id + " ";
    } else if(password[i].type == "arrow") {
      outputString += password[i].id + " ";
      outputString += password[i].idStart + " ";
      outputString += password[i].idEnd + " ";
    } else if(password[i].type == "connected lines") {
      //add all the IDs
      for(j = 0; j < password[i].IDs.length; ++j) {
        outputString += password[i].IDs[j] + " ";
      }
    } else {
      console.log("password_to_string - error: wrong object type")
    }
  }
  return outputString;
}


//from https://stackoverflow.com/questions/4775722/how-to-check-if-an-object-is-an-array
function isArray(obj){
  return !!obj && obj.constructor === Array;
}