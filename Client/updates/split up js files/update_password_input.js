
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
              if(clickInputData[clickInputNodes-2].id === inputEvent.path[0].id){
                clickInputData[clickInputNodes-2].type = "point";
                //store the point
                passwordData[passwordObjects] = [];
                passwordData[passwordObjects].type = "point";
                passwordData[passwordObjects].id = clickInputData[clickInputNodes-2].id + " object " + passwordObjects;
                passwordData[passwordObjects].colour = currentColour;
                ++passwordObjects;
                clear_input();
                //reset the array for points/arrows
                clickInputNodes = 0;
                clickInputData = [];
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
                //reset the array for points/arrows
                clickInputNodes = 0;
                clickInputData = [];
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
            connectedInputData[connectedInputNodes] = [];
            connectedInputData[connectedInputNodes].type = "hover";
            connectedInputData[connectedInputNodes].id = inputEvent.path[0].id;
            ++connectedInputNodes;
            //console.log("hover detected"); 
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
            connectedInputNodes = 0;
            connectedInputData = [];
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