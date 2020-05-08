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
  } else {
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
      tempDrawnPasswordData[tempDrawnPasswordNodes][0].style.cx = tempX + "%";
      tempDrawnPasswordData[tempDrawnPasswordNodes][0].style.cy = tempY + "%";
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
