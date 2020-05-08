
    "use strict";
    //-------------------------------------------Style options--------------------------------------------
    //options for the rectangle for the grid
    let rectWidth = 97, rectHeight = 97, rectBorderRadius = 8, rectVariable;
    //options for the grid of circles
    let gridHeight = 5, gridWidth = 5,
        gridCircRadius = "8.5%", gridStroke = "black", gridStrokeWidth = "2", gridFill = "white",
        gridCircMargin = 13, gridCircDistance = (100-(gridCircMargin*2))/4; //spaces circles evenly, centered in the rectangle

    //options for drawn password
    let passwordDotRadius = 2,
        passwordArrowWidth = 1;



    //-------------------------------------Grid creation + password input event listeners-------------------------------------------
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




    //---------------------------------------------Password input functionality---------------------------------------------
    //variables
    let clickInputData = [], connectedInputData = [], clickInputNodes = 0, connectedInputNodes = 0;
    let passwordData = [], passwordObjects = 0;
    let currentColour = "red";
    let lastDrawnPasswordObjects = 0; //keeps track of how many objects have been drawn in draw_password
    let tempDrawnPasswordData = [], tempDrawnPasswordNodes = 0; //keeps track of drawing in draw_object
    let mousePosXY = [0, 0];
    let tempChild;
    let tempX1 = 0, tempY1 = 0, tempX2 = 0, tempY2 = 0;
    let tempXoffset = 0, tempYoffset = 0;
    i = 0;

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



    //-------------------------------------------------cursor position updating + password drawing and grid updating-------------------------------------------------
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
      mousePosXY[0] = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
      mousePosXY[1] = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
      //console.log("mouseX " + mousePosXY[0] + " mouseY " + mousePosXY[1])
      draw_object();
      update_grid_size();
    }
    
    