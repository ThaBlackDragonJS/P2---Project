
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
      passwordData[passwordObjects] = [];
      --passwordObjects;
      --lastDrawnPasswordObjects;
    }