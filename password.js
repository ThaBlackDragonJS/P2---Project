//----------------------------------------------main matter------------------------------------------------

"use strict";
//-------------------------------------------Style options
//options for the rectangle for the grid
let rectWidth = 97, rectHeight = 97, rectBorderRadius = 8, rectVariable;
//options for the grid of circles
let gridHeight = 5, gridWidth = gridHeight,
    gridCircRadius = "8.5%", gridStroke = "black", gridStrokeWidth = "2", gridFill = "white",
    gridCircMargin = 13, gridCircDistance = (100-(gridCircMargin*2))/(gridHeight-1); //spaces circles evenly, centered in the rectangle

//options for drawn password
let passwordDotRadius = 2,
    passwordArrowWidth = 1;



//-------------------------------------Grid creation + password input event listeners
//other variables
let htmlGrid = document.getElementById("grid1")
let i = 0, j = 0;
let temporaryElement, tempX = 0, tempY = 0;


//Gets viewport dimensions
let vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
let vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
let gridSize = Math.min(vw, vh) * 0.5;
let gridOffsetXY = [];
gridOffsetXY[0] = (vw/2) - (gridSize/2);
gridOffsetXY[1] = (vh/2) - (gridSize/2);
htmlGrid.style.width = gridSize;
htmlGrid.style.height = gridSize;

//Used to debugging viewport dimensions
console.log("Width: " + vw + " Height: " + vh);

//Changes password grid Size based on viewport
function update_grid_size() {
  vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  gridSize = Math.min(vw, vh) * 0.5;
  htmlGrid.style.width = gridSize;
  htmlGrid.style.height = gridSize;
  gridOffsetXY[0] = (vw/2) - (gridSize/2);
  gridOffsetXY[1] = (vh/2) - (gridSize/2);
}




//---------------------------------------------Password input functionality
//variables
let clickInputData = [], connectedInputData = [], clickInputNodes = 0, connectedInputNodes = 0;
let passwordData = [], passwordObjects = 0;
let currentColour = "rgb(255, 52, 52)";
let lastDrawnPasswordObjects = 0; //keeps track of how many objects have been drawn in draw_password
let tempDrawnPasswordData = [], tempDrawnPasswordNodes = 0; //keeps track of drawing in draw_object
let mousePosXY = [0, 0];
let tempChild;
let tempX1 = 0, tempY1 = 0, tempX2 = 0, tempY2 = 0;
let tempXoffset = 0, tempYoffset = 0;
i = 0;
let passwordHiddenBool = 0;


//updates object colour
function update_object_colour(inputColour) {
  currentColour = inputColour;
}

//removes all placed objects
function reset_button() {
  let i, totalToRemove = passwordObjects;
  for(i = 0; i < totalToRemove; ++i) {
    undo_button();
  }
}



//-------------------------------------------------cursor position updating + password drawing and grid updating
//edited, from https://www.dev-notes.com/blog/2008/07/30/get-current-mouse-cursor-position-with-javascript/
//Updates cursor position on mouse movement
init();
function init() {
  if (window.Event) {
    document.captureEvents(Event.MOUSEMOVE);
  }
  document.onmousemove = update_page;
}

function update_page(e) {
  //updates cursor position
  mousePosXY[0] = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
  mousePosXY[1] = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
  //console.log("mouseX " + mousePosXY[0] + " mouseY " + mousePosXY[1])
  draw_object();
  update_grid_size();
  if(passwordHiddenBool == 1) {
    hide_password(0);
  }
}






//----------------------------------------------clear_inputs.js----------------------------------------------
    //clears the currently drawn object(s)
    function clear_input(){
      let i;
      //first delete the data from HTML
      for(i = 0; i < tempDrawnPasswordNodes; ++i) {
        //each temp object can be either an "arrow/point" or a "connected lines segment"
        //first, if it's an "arrows/point", remove the arrow
        if(tempDrawnPasswordData[0][1].id == "tempObjectArrow") {
          tempDrawnPasswordData[i][0].parentNode.removeChild(tempDrawnPasswordData[i][0]);
        }
        //then, regardless of which type it is, remove the [i][1] index (these indexes are used for both points and connected lines)
        tempDrawnPasswordData[i][1].parentNode.removeChild(tempDrawnPasswordData[i][1]);
        //it can be used for both, since they can't both be drawn at once
      }
      //Then delete the data from JS
      tempDrawnPasswordNodes = 0;
      tempDrawnPasswordData = [];
      clickInputData = [];
      clickInputNodes = 0;
      connectedInputData = [];
      connectedInputNodes = 0;
    }





//----------------------------------------------draw_object.js----------------------------------------------
//draws the object you're currently drawing
function draw_object() {
  let tempX = 0, tempY = 0;

  //Only draw a point/arrow if there are click input nodes used
  if(connectedInputNodes > 1) {
    //draw connected lines
    //If there is an arrow/point, delete it
    if(tempDrawnPasswordNodes > 0 && tempDrawnPasswordData[0][1].id == "tempObjectArrow") {
      tempDrawnPasswordData[0][0].parentNode.removeChild(tempDrawnPasswordData[0][0]);
      tempDrawnPasswordData[0][1].parentNode.removeChild(tempDrawnPasswordData[0][1]);
      tempDrawnPasswordNodes = 0;
      tempDrawnPasswordData = [];
    }
    //do the connected lines drawing
    for(i = tempDrawnPasswordNodes; i <= connectedInputNodes; ++i) {
      //Make an arrow
      if(tempDrawnPasswordNodes != connectedInputNodes) { //only draw from start if it hasn't been drawn already
        tempDrawnPasswordData[tempDrawnPasswordNodes] = [];
        tempDrawnPasswordData[tempDrawnPasswordNodes][1] = document.createElementNS("http://www.w3.org/2000/svg", "line");
        //set the first coordinate, in percentage within the grid
        tempX1 = (gridCircMargin+(gridCircDistance*connectedInputData[tempDrawnPasswordNodes].id[7]));
        tempY1 = (gridCircMargin+(gridCircDistance*connectedInputData[tempDrawnPasswordNodes].id[9]));
        tempDrawnPasswordData[tempDrawnPasswordNodes][1].setAttribute('x1', tempX1 + "%");
        tempDrawnPasswordData[tempDrawnPasswordNodes][1].setAttribute('y1', tempY1 + "%");
        //set the second coordinate, in pixel coordinates within the viewport
        tempX2 = (mousePosXY[0]-gridOffsetXY[0]);
        tempY2 = (mousePosXY[1]-gridOffsetXY[1]);
        tempDrawnPasswordData[tempDrawnPasswordNodes][1].setAttribute('x2', tempX2);
        tempDrawnPasswordData[tempDrawnPasswordNodes][1].setAttribute('y2', tempY2);
        //set other values
        tempDrawnPasswordData[tempDrawnPasswordNodes][1].setAttribute('stroke-width', gridStrokeWidth + "%");
        tempDrawnPasswordData[tempDrawnPasswordNodes][1].setAttribute('stroke', currentColour);
        tempDrawnPasswordData[tempDrawnPasswordNodes][1].setAttribute('marker-end', "url(#arrowhead)");
        tempDrawnPasswordData[tempDrawnPasswordNodes][1].classList.add("noclick");
        tempDrawnPasswordData[0][1].id = "tempObjectConnected";
        htmlGrid.appendChild(tempDrawnPasswordData[tempDrawnPasswordNodes][1]);
        //only increase the number of nodes when drawing a new line
        ++tempDrawnPasswordNodes;
      } else if(tempDrawnPasswordNodes != 0) { //if it has been drawn, update its end placement and previous lines end placement
        //make the arrow 20% shorter than the distance to the cursor
        //change the current lines 2nd coordinate, again in pixel coordinates within the viewport
        tempX2 = (mousePosXY[0]-gridOffsetXY[0]);
        tempY2 = (mousePosXY[1]-gridOffsetXY[1]);
        tempDrawnPasswordData[tempDrawnPasswordNodes-1][1].setAttribute('x2', tempX2);
        tempDrawnPasswordData[tempDrawnPasswordNodes-1][1].setAttribute('y2', tempY2);  
        //set the prior lines second coordinate, in percentage within the grid
        tempX2 = (gridCircMargin+(gridCircDistance*connectedInputData[tempDrawnPasswordNodes-1].id[7]));
        tempY2 = (gridCircMargin+(gridCircDistance*connectedInputData[tempDrawnPasswordNodes-1].id[9]));
        tempDrawnPasswordData[tempDrawnPasswordNodes-2][1].setAttribute('x2', tempX2 + "%");
        tempDrawnPasswordData[tempDrawnPasswordNodes-2][1].setAttribute('y2', tempY2 + "%");
        //update the prior line to not be an arrow
        tempDrawnPasswordData[tempDrawnPasswordNodes-2][1].setAttribute('marker-end', "");
      }
    }
  } else { //if it isn't connected lines, draw arrow/point
    //draw point/arrow
    //draw a gray point and a gray arrow, since we don't know which it will end up being
    //---first the point
    tempDrawnPasswordData[tempDrawnPasswordNodes] = [];
    if(tempDrawnPasswordNodes != clickInputNodes) { //only draw if it hasn't been drawn already
      tempDrawnPasswordData[tempDrawnPasswordNodes][0] = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      tempDrawnPasswordData[tempDrawnPasswordNodes][0].style.r = passwordDotRadius + "%";
      tempDrawnPasswordData[tempDrawnPasswordNodes][0].style.fill = currentColour;
      tempX = (gridCircMargin+(gridCircDistance*clickInputData[tempDrawnPasswordNodes].id[7]));
      tempY = (gridCircMargin+(gridCircDistance*clickInputData[tempDrawnPasswordNodes].id[9]));
      tempDrawnPasswordData[tempDrawnPasswordNodes][0].setAttribute("cx", tempX + "%");
      tempDrawnPasswordData[tempDrawnPasswordNodes][0].setAttribute("cy", tempY + "%");
      tempDrawnPasswordData[tempDrawnPasswordNodes][0].classList.add("noclick");
      htmlGrid.appendChild(tempDrawnPasswordData[tempDrawnPasswordNodes][0]);
    }
    //---then the arrow
    if(tempDrawnPasswordNodes != clickInputNodes) { //only draw from start if it hasn't been drawn already
      tempDrawnPasswordData[tempDrawnPasswordNodes][1] = document.createElementNS("http://www.w3.org/2000/svg", "line");
      //set the first coordinate, in percentage within the grid
      tempX1 = (gridCircMargin+(gridCircDistance*clickInputData[tempDrawnPasswordNodes].id[7]));
      tempY1 = (gridCircMargin+(gridCircDistance*clickInputData[tempDrawnPasswordNodes].id[9]));
      tempDrawnPasswordData[tempDrawnPasswordNodes][1].setAttribute('x1', tempX1 + "%");
      tempDrawnPasswordData[tempDrawnPasswordNodes][1].setAttribute('y1', tempY1 + "%");
      //set the second coordinate, in pixel coordinates within the viewport
      tempX2 = (mousePosXY[0]-gridOffsetXY[0]);
      tempY2 = (mousePosXY[1]-gridOffsetXY[1]);
      tempDrawnPasswordData[tempDrawnPasswordNodes][1].setAttribute('x2', tempX2);
      tempDrawnPasswordData[tempDrawnPasswordNodes][1].setAttribute('y2', tempY2);
      //set other values
      tempDrawnPasswordData[tempDrawnPasswordNodes][1].setAttribute('stroke-width', gridStrokeWidth + "%");
      tempDrawnPasswordData[tempDrawnPasswordNodes][1].setAttribute('stroke', currentColour);
      tempDrawnPasswordData[tempDrawnPasswordNodes][1].setAttribute('marker-end', "url(#arrowhead)");
      tempDrawnPasswordData[tempDrawnPasswordNodes][1].classList.add("noclick");
      tempDrawnPasswordData[tempDrawnPasswordNodes][1].id = "tempObjectArrow";
      htmlGrid.appendChild(tempDrawnPasswordData[tempDrawnPasswordNodes][1]);
      //only increase the number of nodes when drawing a new line
      ++tempDrawnPasswordNodes;
    } else if(tempDrawnPasswordNodes != 0) { //if it has been drawn, update its end placement
      //change the 2nd coordinate, again in pixel coordinates within the viewport
      tempX2 = (mousePosXY[0]-gridOffsetXY[0]);
      tempY2 = (mousePosXY[1]-gridOffsetXY[1]);
      tempDrawnPasswordData[tempDrawnPasswordNodes-1][1].setAttribute('x2', tempX2);
      tempDrawnPasswordData[tempDrawnPasswordNodes-1][1].setAttribute('y2', tempY2);  
    }
  }
}





//----------------------------------------------draw_password.js----------------------------------------------

    //draws the password objects that have been completed
    function draw_password() {
      let tempLength = 0, tempRotation = 0;
      let tempX1 = 0, tempY1 = 0,
          tempX2 = 0, tempY2 = 0;
      let tempSlope1 = 0, tempSlope2 = 0, 
          tempHeight = 0,
          tempIntersectX = 0, tempIntersectY = 0,
          tempFinalX = 0, tempFinalY = 0,
          finalX = 0, finalY = 0;
      let i = 0, j = 0;
      //start at the number of drawn objects to avoid re-drawing them
      for(i = lastDrawnPasswordObjects; i < passwordObjects; ++i) {
        //find out if it's a point, arrow or connected lines
        if(passwordData[i].type === "connected lines") {
          //draw connected lines
          for(j = 0; j < passwordData[i].IDs.length-1; ++j) {
            //draw a line
            temporaryElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
            tempX1 = (gridCircMargin+(gridCircDistance*passwordData[i].IDs[j][7]));
            tempY1 = (gridCircMargin+(gridCircDistance*passwordData[i].IDs[j][9]));
            tempX2 = (gridCircMargin+(gridCircDistance*passwordData[i].IDs[j+1][7]));
            tempY2 = (gridCircMargin+(gridCircDistance*passwordData[i].IDs[j+1][9]));
            temporaryElement.setAttribute('stroke-width', gridStrokeWidth + "%");
            temporaryElement.setAttribute('stroke', currentColour);
            temporaryElement.setAttribute('x1', tempX1 + "%");
            temporaryElement.setAttribute('y1', tempY1 + "%");
            temporaryElement.setAttribute('x2', tempX2 + "%");
            temporaryElement.setAttribute('y2', tempY2 + "%");
            temporaryElement.setAttribute('id', passwordData[i].IDs[j]);
            temporaryElement.classList.add("noclick");
            //draw an arrowhead if it's the last line
            if(j === passwordData[i].IDs.length-2) {
              temporaryElement.setAttribute('marker-end', "url(#arrowhead)");
            }
            htmlGrid.appendChild(temporaryElement);
          }
        } else if (passwordData[i].type === "arrow"){
          //draw an arrow
          temporaryElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
          tempX1 = (gridCircMargin+(gridCircDistance*passwordData[i].idStart[7]));
          tempY1 = (gridCircMargin+(gridCircDistance*passwordData[i].idStart[9]));
          tempX2 = (gridCircMargin+(gridCircDistance*passwordData[i].idEnd[7]));
          tempY2 = (gridCircMargin+(gridCircDistance*passwordData[i].idEnd[9]));
          temporaryElement.setAttribute('stroke-width', gridStrokeWidth + "%");
          temporaryElement.setAttribute('stroke', currentColour);
          temporaryElement.setAttribute('x1', tempX1 + "%");
          temporaryElement.setAttribute('y1', tempY1 + "%");
          temporaryElement.setAttribute('x2', tempX2 + "%");
          temporaryElement.setAttribute('y2', tempY2 + "%");
          temporaryElement.setAttribute('id', passwordData[i].id);
          temporaryElement.setAttribute('marker-end', "url(#arrowhead)");
          temporaryElement.classList.add("noclick");
          htmlGrid.appendChild(temporaryElement);
        } else if (passwordData[i].type === "point") {
          //draw a point
          temporaryElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          temporaryElement.setAttribute("r", passwordDotRadius + "%");
          temporaryElement.style.fill = currentColour;
          tempFinalX = (gridCircMargin+(gridCircDistance*passwordData[i].id[7]));
          tempFinalY = (gridCircMargin+(gridCircDistance*passwordData[i].id[9]));
          temporaryElement.setAttribute("cx", tempFinalX + "%");
          temporaryElement.setAttribute("cy", tempFinalY + "%");
          temporaryElement.setAttribute('id', passwordData[i].id);
          temporaryElement.classList.add("noclick");
          htmlGrid.appendChild(temporaryElement);
        } else {
          console.log("draw_password - error: wrong object type");
        }
        ++lastDrawnPasswordObjects;
      }
    }





//----------------------------------------------encrypt_string.js----------------------------------------------
//encryption from https://www.movable-type.co.uk/scripts/aes.html

//teststring
//var testString = "rfajewriofjwaoigfejb ioergniggdyeiuafreygiueraybiuerayrteaiubyer";


function encrypt_string(input, callback){ 

  //input != string error handling
  if (typeof input != "string"){
    console.log("encrypt_string - error: input is not a string");
    return;
  }

  //gets the encryption password
  //throws an error but does work - fix later if there's enough time
  let output = "";
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "getPassword", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      output = xhr.responseText;
      encryptionPassword = output;
      //encrypting function
      const ciphertext = Aes.Ctr.encrypt(input, encryptionPassword, 256);
      /*console.log("encryption password: " + encryptionPassword);
      console.log("ciphertext: " + ciphertext);
      const origtext = Aes.Ctr.decrypt(ciphertext, encryptionPassword, 256);
      console.log("original: " + origtext);*/

      //returns using a callback
      callback(ciphertext);
    }
  }
  xhr.send();
}






//----------------------------------------------initiate_password_grid.js----------------------------------------------

    //sets up the password grid
    initiate_password_grid();
    function initiate_password_grid() {
      //sets the grid's rectangle's style
      rectVariable = document.getElementById("gridFrame");
      //calculates and sets the margin
      tempX = (100-rectWidth)/2;
      tempY = (100-rectHeight)/2;
      rectVariable.style.x = tempX + "%";
      rectVariable.style.y = tempY + "%";
      //width and height
      rectVariable.style.width = rectWidth + "%";
      rectVariable.style.height = rectHeight + "%";
      //corner radius
      rectVariable.style.rx = rectBorderRadius + "%";
      rectVariable.style.ry = rectBorderRadius + "%";

      //generates circles and names them "circle i j" with the i and j coordinates from 0 to 4
      for(i = 0; i < gridHeight; i++) {
        for(j = 0; j < gridWidth; j++) {
          //creates element
          temporaryElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");

          //assigns placement, size and style
          tempX = (gridCircMargin+(gridCircDistance*j));
          tempY = (gridCircMargin+(gridCircDistance*i));
          temporaryElement.setAttribute("cx", tempX + "%");
          temporaryElement.setAttribute("cy", tempY + "%");
          //temporaryElement.style.r = gridCircRadius; is now done in css
          temporaryElement.style.stroke = gridStroke;
          temporaryElement.style["stroke-width"] = gridStrokeWidth;
          temporaryElement.style.fill = gridFill;
          temporaryElement.classList.add("node");

          //assigns ID and actions
          temporaryElement.id = "circle " + j + " " + i;
          temporaryElement.addEventListener("mouseover", function mouse_over(inputEvent){ 
            update_password_input(inputEvent, "hover"); 
          });
          temporaryElement.addEventListener("mousedown", function mouse_over(inputEvent){ 
            update_password_input(inputEvent, "press"); 
          });
          temporaryElement.addEventListener("mouseup", function mouse_over(inputEvent){ 
            update_password_input(inputEvent, "release"); 
          });

          //appends to the grid
          htmlGrid.appendChild(temporaryElement);
        }
      }
    }





//----------------------------------------------password_to_string.js----------------------------------------------
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
    //the undo button doesn't completely delete data, this ignores deleted data
    if(password[i].type != undefined) {
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
  }
  return outputString;
}


//from https://stackoverflow.com/questions/4775722/how-to-check-if-an-object-is-an-array
function isArray(obj){
  return !!obj && obj.constructor === Array;
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





//----------------------------------------------undo_button.js----------------------------------------------

    //removes the most recently placed object
    function undo_button() {
      if(passwordObjects == 0) {
        return; //do nothing if there's no objects
      }
      let temporaryID;
      let temporaryElement = passwordData[passwordObjects-1];
      let i = 0;

      //if it's an arrow/point, delete the 1 html element
      if(temporaryElement.type == "arrow" || temporaryElement.type == "point") {
        temporaryID = document.getElementById(temporaryElement.id);
        temporaryID.parentNode.removeChild(temporaryID);
      } else {
        //if it's a "connected lines" object, remove all the lines
        for(i = 0; i < temporaryElement.IDs.length-1; ++i) {
          temporaryID = document.getElementById(temporaryElement.IDs[i]);
          temporaryID.parentNode.removeChild(temporaryID);
        }
      }

      //delete the object
      passwordData[passwordObjects-1] = [];
      --passwordObjects;
      --lastDrawnPasswordObjects;
    }





//----------------------------------------------update_password_input.js----------------------------------------------

    //Object creator + Password creator  --- also calls draw_password to update it, and clear_input to remove the "temporary" objects
    function update_password_input(inputEvent, inputType){
      //debugging
      /*
      console.log(inputEvent.path[0].id);
      console.log(inputEvent.buttons);
      console.log(inputType);
      console.log("");
      */
      
      //Point and Arrow input
      if(inputType === "press"){
        //console.log("detected press")
        clickInputData[clickInputNodes] = [];
        clickInputData[clickInputNodes].type = "press";
        clickInputData[clickInputNodes].id = inputEvent.path[0].id;
        clickInputData[clickInputNodes].buttons = inputEvent.buttons;
        ++clickInputNodes;
      } else if (inputType === "release") {
        //console.log("detected release")
        //if the previous input was a press, and it is now released, it can only be a click
        if(clickInputData[clickInputNodes-1].type === "press"){
          if(clickInputData[clickInputNodes-1].id === inputEvent.path[0].id){
            clickInputData[clickInputNodes-1].type = "click";
            //console.log("saved click");
            //check if it is a point/arrow
            if(clickInputNodes >= 2 && clickInputData[clickInputNodes-2].type === "click"){
              //first, if it is a point (same id)
              if(clickInputData[clickInputNodes-2].id === inputEvent.path[0].id){
                clickInputData[clickInputNodes-2].type = "point";
                //store the point
                passwordData[passwordObjects] = []; //make it a 2D array
                passwordData[passwordObjects].type = "point";
                passwordData[passwordObjects].id = clickInputData[clickInputNodes-2].id + " object " + passwordObjects;
                passwordData[passwordObjects].colour = currentColour;
                ++passwordObjects;
                clear_input();
                //console.log("Created Point");
              } else { //not the same id means it's an arrow
                clickInputData[clickInputNodes-2].type = "arrow";
                //store the arrow
                passwordData[passwordObjects] = [];
                passwordData[passwordObjects].type = "arrow";
                passwordData[passwordObjects].id = "circle arr" + " object " + passwordObjects;
                passwordData[passwordObjects].idStart = clickInputData[clickInputNodes-2].id;
                passwordData[passwordObjects].idEnd = inputEvent.path[0].id;
                passwordData[passwordObjects].colour = currentColour;
                ++passwordObjects;
                clear_input();
                //console.log("Created Arrow");
              }
            }
          }
        }
      }

      //Connected lines input
      if (inputType === "press" && connectedInputNodes == 0) {
        //press is the start of the input for connected lines
        connectedInputData[connectedInputNodes] = [];
        connectedInputData[connectedInputNodes].type = "press";
        connectedInputData[connectedInputNodes].id = inputEvent.path[0].id;
        ++connectedInputNodes;
        //console.log("press detected");
      } else if (inputType === "hover" && inputEvent.buttons === 1) {
        //do nothing if there's no input yet, as the start condition is a press
        if(connectedInputNodes !== 0) {
          //if it's the same node as last then it doesn't count as a new one
          if(connectedInputData[connectedInputNodes-1].id !== inputEvent.path[0].id){
            //if the node is not within the 8 sorrounding the previous node, it also doesn't count
            //first get the X and Y coordinates of the current and previous nodes
            let currentX = parseInt(inputEvent.path[0].id[7]);
            let currentY = parseInt(inputEvent.path[0].id[9]);
            let priorX = parseInt(connectedInputData[connectedInputNodes-1].id[7]);
            let priorY = parseInt(connectedInputData[connectedInputNodes-1].id[9]);
            /*console.log("cX, cY, pX, pY");
            console.log(currentX + " | " + currentY + " | " + priorX + " | " + priorY);
            console.log("priorX-1 <= currentX: " + (priorX-1 <= currentX));
            console.log("currentX <= priorX+1: " + (currentX <= (priorX+1)));
            console.log("X coordinate within: " + (priorX-1 <= currentX && currentX <= priorX+1));*/
            //then check if the X coordinate is within 1 distance
            //priorX-1 <= currentX <= priorX+1
            if(priorX-1 <= currentX && currentX <= priorX+1) {
              //lastly do the same check for Y coordinate
              if(priorY-1 <= currentY && currentY <= priorY+1) {
                connectedInputData[connectedInputNodes] = [];
                connectedInputData[connectedInputNodes].type = "hover";
                connectedInputData[connectedInputNodes].id = inputEvent.path[0].id;
                ++connectedInputNodes;
                //console.log("hover detected"); 
              }
            }
          }
        }
      } else if (inputType === "release") {
        //check if the connected lines have been started
        if(connectedInputNodes >= 2) {
          //if the previous node is the same node then don't make "connected lines", and instead reset the array
          if(connectedInputData[connectedInputNodes-2].id !== inputEvent.path[0].id){
            passwordData[passwordObjects] = [];
            passwordData[passwordObjects].type = "connected lines";
            passwordData[passwordObjects].IDs = [];
            for(i = 0; i < connectedInputNodes; ++i){
              passwordData[passwordObjects].IDs[i] = connectedInputData[i].id + " object " + passwordObjects;
            }
            passwordData[passwordObjects].colour = currentColour;
            ++passwordObjects;
            clear_input();
            //console.log("release detected"); 
          } else {
            connectedInputNodes = 0;
            connectedInputData = [];
          }
        }
      }
      //update how the password is drawn
      draw_password();
    }


function sign_in_or_up_finish(inOrUp) {
  //check if the password is within the minimum requirements
  if(requirement_checker(passwordData, passwordObjects, gridWidth, gridHeight) == 0) {
    alert("Password not within requirements.")
    return;
  }
  //get the email
  let email = get_cookie("email");

  //make a new XML http request
  let xhr = new XMLHttpRequest();
  //send the email and password
  xhr.open("POST", window.location.href, true); //find out what that "true" value is for
  xhr.setRequestHeader('Content-Type', 'application/json'); //find out if it needs to be json
  //wait for response
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4)  { 
      //server has now given response
      let serverResponse = xhr.responseText;
      if(serverResponse == "success") {
        alert("Sign in successful!")
        //redirect to the page that tells you the login was successful
        //window.location.replace(window.location.href + "SignedIn");
      }else if(serverResponse == "failure") {
        alert("wrong password");
      }
    }
  }
  //encrypt the email and password, and then send the response
  encrypt_string(email, callback_local_one);
  function callback_local_one(encryptedStringOne) {
    let encryptedEmail = encryptedStringOne;
    encrypt_string(password_to_string(passwordData), callback_local_two);
    function callback_local_two(encryptedStringTwo) {
      let encryptedPassword = encryptedStringTwo;
      console.log(encryptedEmail);
      console.log(encryptedPassword);
      xhr.send(encryptedEmail + " " + encryptedPassword);
    }
  }
}

function hide_password(setBool){
  if(setBool == 1) {
    passwordHiddenBool = 1;
  }
  let i = 0;
  let noClick = document.getElementsByClassName("noclick");
  for(i; i < noClick.length; ++i) {
    noClick[i].style.visibility = "hidden";
  }
}

function unhide_password() {
  passwordHiddenBool = 0;
  let i = 0;
  let noClick = document.getElementsByClassName("noclick");
  for(i; i < noClick.length; ++i) {
    noClick[i].style.visibility = "visible";
  }
}

let encryptionPassword = get_password();
function get_password() {
  let output = "";
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "getPassword", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      output = xhr.responseText;
      //console.log(output);
      return output;
    }
  };
  xhr.send();
}

//edited from https://www.w3schools.com/js/js_cookies.asp
function get_cookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}