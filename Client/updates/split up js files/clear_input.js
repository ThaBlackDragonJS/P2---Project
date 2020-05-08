    //clears the currently drawn object(s)
    function clear_input(){
      let i;
      for(i = 0; i < tempDrawnPasswordNodes; ++i) {
        if(tempDrawnPasswordData[0][1].id == "tempObjectArrow") {
          tempDrawnPasswordData[i][0].parentNode.removeChild(tempDrawnPasswordData[i][0]);
        }
        tempDrawnPasswordData[i][1].parentNode.removeChild(tempDrawnPasswordData[i][1]);
      }
      tempDrawnPasswordNodes = 0;
      tempDrawnPasswordData = [];
      clickInputData = [];
      clickInputNodes = 0;
      connectedInputData = [];
      connectedInputNodes = 0;
    }