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

let ctm;
let ctmLoc; 

var objID;
var objIDLoc;

var objCurrentTxTy = [];
var objCurrentRxRy = [];

var swapColors = false;
var colorSelectionIndex = [3, 2, 4, 0, 4, 5, 6, 3, 7, 0, 1, 3];

let rox = 0;
let roy = 0; 
let roz = 0;

window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");
    aspect =  canvas.width/canvas.height;

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);

    runMainProgram();

    // load vertices and vertex colors
    loadSquarePyramid(numPointsSquarePyramid); 
    loadTrianglePyramid(numPointsTrianglePyramid);
    loadCube(numPointsCube);

    // set up shader variables and attributes
    setUpBufferAndAttrib();
    ctmLoc = gl.getUniformLocation(currentProgram, "ctm" );

    // add event listeners to detect for user keyboard and mouse click
    // activates either rotation or translation
    addMouseEventListeners();
    addKeyEventListener();

   
    render();
}


function render()
{
    // set tx ty based on click id
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    // draw call information on each object. The following indices represent: 
    // objType, objID, sc, numElements, offset, numVertexColors, color offset
    let objectsToDrawInfo = [
        [0, 0, 0.3, numPointsSquarePyramid, 0, colorList[colorSelectionIndex[0]], 5, 0],
        [0, 1, 0.39, numPointsSquarePyramid, 0, colorList[colorSelectionIndex[1]], 5, 0],
        [0, 2, 0.25, numPointsSquarePyramid, 0, colorList[colorSelectionIndex[2]], 5, 0],
        [0, 3, 0.25, numPointsSquarePyramid, 0, colorList[colorSelectionIndex[3]], 5, 0],
        [1, 4, 0.2, numPointsTrianglePyramid, 18, colorList[colorSelectionIndex[4]], 9, 4],
        [1, 5, 0.75, numPointsTrianglePyramid, 18, colorList[colorSelectionIndex[5]], 9, 4],
        [1, 6, 0.3, numPointsTrianglePyramid, 18, colorList[colorSelectionIndex[6]], 9, 4],
        [1, 7, 0.60, numPointsTrianglePyramid, 18, colorList[colorSelectionIndex[7]], 9, 4],
        [2, 8, 0.2, numPointsCube, 30, colorList[colorSelectionIndex[8]], 17, 9],
        [2, 9, 0.30, numPointsCube, 30, colorList[colorSelectionIndex[9]], 17, 9],
        [2, 10, 0.25, numPointsCube, 30, colorList[colorSelectionIndex[10]], 17, 9],
        [2, 11, 0.15, numPointsCube, 30, colorList[colorSelectionIndex[11]], 17, 9],
    ]

    // draw each object
    for (var i = 0; i < objectsToDrawInfo.length; i++) {
        let [objType, objID, scale, numElements, offset, vertexColors, tNumVertColors, cOffset] = objectsToDrawInfo[i];

        // load specific color for each object
        loadVertexColors(vertexColors, tNumVertColors, cOffset);
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
        drawObject(objType, objID, scale, numElements, offset);
    }
    requestAnimationFrame(render);
}

// create buffers, bind buffer and binds data
function setUpBufferAndAttrib() {
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

}

//// CURRENTLY NOT IMPLEMENTED
// function runSelectorProgram() {
//     console.log("using selector program")
//     selectorProgram = initShaders(gl, "s-vertex-shader", "s-fragment-shader");
//     gl.useProgram(selectorProgram);
//     currentProgram = selectorProgram;
// }

// uses the visible program
function runMainProgram() {
    console.log("using main program")
    mainProgram = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(mainProgram);
    currentProgram = mainProgram;

}

// draws each object
function drawObject(objType, objID, sc, numElements, offset) {
    // translates each object to their initial position, ordered by id 
    if (objCurrentTxTy[objID] == null) {
        let x = ((objID % 4)* 0.45) - 0.65;
        let y = ((objType - 1) * -0.55);
        objCurrentTxTy[objID] = [x, y];
        
    }
    // sets the initial rotation to zero 
    if (objCurrentRxRy[objID] == null) {
        objCurrentRxRy[objID] = [0, 0, 0];
    }
    var txtyArr = [0,0];
    // if obj is picked apply motion
    if (objID == pickedObjID) {
        if (swapColors & (objID == pickedObjID)) {
            let colorIndex = Math.floor(Math.random() * colorList.length);
            colorSelectionIndex[pickedObjID] = colorIndex;
            swapColors = false;
        }
        // calculate translation factor based on mouse move distance
        if (translate & mouseIsDown & isDragging) {

            txtyArr = objCurrentTxTy[objID]; 
            txtyArr[0] += txFactor;
            txtyArr[1] += tyFactor;
            objCurrentTxTy[objID] = txtyArr;
            txFactor = 0;
            tyFactor = 0;
        }
        // get rotation angle based on direction of mouse rotation
        if (!translate & mouseIsDown & isDragging) {
            objCurrentRxRy[objID] = getRotationAngle(objID);
        }
    }
    else {
        // set default rotation when user is not controlling rotation
        roy += -0.05;
        objCurrentRxRy[objID] = [0, roy, 0];
    }

    // save translation factor for the current object for next render
    txtyArr = objCurrentTxTy[objID];
    tx = txtyArr[0] || 0;
    ty = txtyArr[1] || 0;
    axisRotation = objCurrentRxRy[objID];
    // calculations current translation matrix to be sent to shader
    let tm = calcTranslationMat(tx, ty, objID, objType);
    let rm = calcRotationMat(axisRotation);
    let sm = calcScaleMat(sc);
    ctm = calcCtm(tm, sm, rm);
    gl.uniformMatrix4fv(ctmLoc, false, flatten(ctm));

    // draw object
    gl.drawElements(gl.TRIANGLES, numElements, gl.UNSIGNED_BYTE, offset);

} 

 