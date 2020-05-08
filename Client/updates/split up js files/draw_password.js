
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