
    //sets up the password grid
    initiate_password_grid();
    function initiate_password_grid() {
      //sets the grid's rectangle's style
      rectVariable = document.getElementById("gridFrame");
      tempX = (100-rectWidth)/2;
      tempY = (100-rectHeight)/2;
      rectVariable.style.x = tempX + "%";
      rectVariable.style.y = tempY + "%";
      rectVariable.style.width = rectWidth + "%";
      rectVariable.style.height = rectHeight + "%";
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