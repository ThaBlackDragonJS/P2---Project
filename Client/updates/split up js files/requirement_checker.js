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
    if(passwordData[i].colour == "red") {
      coloursUsed[0] = 1;
    } else if (passwordData[i].colour == "green") {
      coloursUsed[1] = 1;
    } else if (passwordData[i].colour == "blue") {
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