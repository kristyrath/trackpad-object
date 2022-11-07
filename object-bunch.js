var positions = []
var colors = [];
var indices = [];
var redColor = [];
var tempColors = [];
var numPointsSquarePyramid= 18;
var numPointsTrianglePyramid= 12;
var numPointsCube= 36;
var numInstances = 3;
var canvas;
var gl;
var objType; // 0 - Square pyramid, 1 - Triangle pyramid, 2 - Cube 
var objTypeLoc;
var objType2;
var objTypeLoc2;
var changeColor = 0; // temp storage
var changeColorLoc;

var axisRotationLoc;
var isClicked = 0;
var cBuffer;
var vBuffer;
var mainProgram;
var selectorProgram;
var currentProgram; 

var tx = 0;
var ty = 0;
var txLoc;
var tyLoc;
var scLoc;
var sc = 0.2;
var i = 0;

var objID;
var objIDLoc;

var objCurrentTxTy = [];
var objCurrentRxRy = [];

window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");
    aspect =  canvas.width/canvas.height;

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    gl.enable(gl.DEPTH_TEST);

    runMainProgram();

    loadSquarePyramid(numPointsSquarePyramid); 
    loadTrianglePyramid(numPointsTrianglePyramid);
    loadCube(numPointsCube);

   

  


    // create and allocate buffer data

    var dBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, dBuffer);
    
    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(currentProgram, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( currentProgram, "aPosition");
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc );


    getUniformLocations();


    addMouseEventListeners();
    addKeyEventListener();
    render();
}


function render()
{
    // set tx ty based on click id
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    // draw each object instances
    //objType, objID, sc, numElements, offset
    var objectsToDrawInfo = [
        [0, 0, 0.3, numPointsSquarePyramid, 0],
        [0, 1, 0.2, numPointsSquarePyramid, 0],
        [0, 2, 0.25, numPointsSquarePyramid, 0],
        [1, 3, 0.2, numPointsTrianglePyramid, 18],
        [1, 4, 0.35, numPointsTrianglePyramid, 18],
        [1, 5, 0.3, numPointsTrianglePyramid, 18],
        [2, 6, 0.2, numPointsCube, 30],
        [2, 7, 0.30, numPointsCube, 30],
        [2, 8, 0.25, numPointsCube, 30],
        [2, 9, 0.27, numPointsCube, 30]
    ]
    for (var i = 0; i < objectsToDrawInfo.length; i++) {
        let [objType, objID, scale, numElements, offset] = objectsToDrawInfo[i];
        drawObject(objType, objID, scale, numElements, offset);
    }
    requestAnimationFrame(render);
}



function runSelectorProgram() {
    console.log("using selector program")
    selectorProgram = initShaders(gl, "s-vertex-shader", "s-fragment-shader");
    gl.useProgram(selectorProgram);
    currentProgram = selectorProgram;
}
function runMainProgram() {
    console.log("using main program")
    mainProgram = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(mainProgram);
    currentProgram = mainProgram;

}



function getUniformLocations() {
  // get uniform locations
  txLoc = gl.getUniformLocation(currentProgram, 'tx');
  tyLoc = gl.getUniformLocation(currentProgram, 'ty');
  objTypeLoc = gl.getUniformLocation(currentProgram, "objType");
  objTypeLoc2 = gl.getUniformLocation(currentProgram, "objType2");
  scLoc = gl.getUniformLocation(currentProgram, 'sc');
  axisRotationLoc = gl.getUniformLocation(currentProgram, "axisRotation");
  oldThetaLoc = gl.getUniformLocation(currentProgram, "oldTheta");
  objIDLoc = gl.getUniformLocation(currentProgram, 'objID');
  idLoc = gl.getUniformLocation(currentProgram, 'id');
  if (currentProgram == mainProgram) {
    changeColorLoc = gl.getUniformLocation(currentProgram, 'changeColor');
  }
}

function drawObject(objType, objID, sc, numElements, offset) {
    // check controls to rotate or translate

    // initialize array of empty translation coordinates for each object
    if (objCurrentTxTy[objID] == null) {
        objCurrentTxTy[objID] = [0, 0];
    }
    if (objCurrentRxRy[objID] == null) {
        objCurrentRxRy[objID] = [0, 0, 0];
    }
    var txtyArr = [0,0];
    // if obj is picked apply motion
    if (objID == pickedObjID) {
        
        if (translate & mouseIsDown & isDragging) {

            txtyArr = objCurrentTxTy[objID]; // issue no val
            txtyArr[0] += txFactor;
            txtyArr[1] += tyFactor;
            objCurrentTxTy[objID] = txtyArr;
            txFactor = 0;
            tyFactor = 0;

            console.log("CURRENT TX TY: ", objCurrentTxTy[objID]);
        }
        if (!translate & mouseIsDown & isDragging) {
            objCurrentRxRy[objID] = getRotationAngle(objID);
        }
    }
    // set tx ty for the obj
    txtyArr = objCurrentTxTy[objID];
    tx = txtyArr[0];
    ty = txtyArr[1];
  
    // set axis rotation 
    axisRotation = objCurrentRxRy[objID];
    
    // assign color change
    // set color change
    if (currentProgram == mainProgram) {
        if (objChangeColor[objID] == null) {
            objChangeColor[objID] = 0;
        }
        changeColor = objChangeColor[objID];
        gl.uniform1i(changeColorLoc, changeColor);
    }
    id = objID;
    // set uniforms
    gl.uniform1f(txLoc, tx);
    gl.uniform1f(tyLoc, ty);
    gl.uniform1f(scLoc, sc);
    gl.uniform3fv(axisRotationLoc, axisRotation);
    gl.uniform1i(objTypeLoc, objType);
    gl.uniform1i(objTypeLoc2, objType2);
    gl.uniform1i(objIDLoc, objID);
    gl.uniform1i(idLoc, id);

    gl.drawElements(gl.TRIANGLES, numElements, gl.UNSIGNED_BYTE, offset);

} 

 