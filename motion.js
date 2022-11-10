var axisRotation = [0, 0, 0];

var axisTranslationLoc;
var newX = 0.3;
var newY = 0.3;

var currentLocation;
var previousLocation = []; 

var mouseIsDown = false;
var isDragging = false;

var xChanged = false;
var yChanged = false;

var angleX = 0;
var angleY = 0;
var previousAngleX;
var previousAngleY;

var prevKeyIsT = false;

var translate = false;
var shiftX;
var shiftY;

var txFactor=0;
var tyFactor=0;

var pickedObjID;
var objChangeColor = [];

function addMouseEventListeners() {
    canvas.addEventListener('mousemove', (event) => {
        // get current location and save previous location
        previousLocation[pickedObjID] = currentLocation;
        currentLocation = getCurrentLocation(event, 'center-origin');
        isDragging = true;
        // check whether to translate or rotate the object
        if (mouseIsDown & isDragging) {
            if (translate) {
                var xyArr = calcTranlationXY(currentLocation, previousLocation[pickedObjID]);
                txFactor = xyArr[0];
                tyFactor = xyArr[1]; 
            }
            else {
                if (previousLocation[pickedObjID] == null) {
                    previousRLocation[pickedObjID] = [currentLocation[0], currentLocation[1], 0];
                }
                // rotates based on the speed of the user's drag motion
                dragMotion(currentLocation, previousLocation, pickedObjID);
            }
        }
    })
    // listens for user click and gets object id
    canvas.addEventListener('mousedown', (event) => {
        mouseIsDown = true;
        // pickedObjID = document.getElementById("options").value;
    })
    var options =  document.getElementById('options')
    options.onchange = () => {
        pickedObjID = options.value;
    }
    // listens for when to stop translation and rotation
    canvas.addEventListener('mouseup', (event) => {
        mouseIsDown = false; 
        isDragging = false;
    })
}
function addKeyEventListener(){
    // listen for key press and activates either translation or color swapping
    document.addEventListener('keydown', (event) => {
        if (event.key === 't' || event.key === 'T' ) {
            translate = true;
        }
        if (event.key == 'c' || event.key == 'C') {
            swapColors = true;
        }
    }) 
    document.addEventListener('keyup', (event) => {
        translate = false;
    }) 
}
// uses distance and derivative to calculate the angle of rotation
function dragMotion(currentLocation, previousLocation, objID) {
    previousAngleX = angleX;
    previousAngleY = angleY;
    // // calculate distance
    newX = currentLocation[0];
    newY = currentLocation[1];

    // calc speed of rotation 
    var axisSpeed = calcRotationSpeedXY(currentLocation, previousLocation[objID]);
    var dx = axisSpeed[0];
    var dy = axisSpeed[1];
    // calc angle of rotation 
    
    angleX = angleX + dy;
    angleY = angleY + dx;
}
// calculations the directional vector between two points
function calcTranlationXY(currentLocation, previousLocation) {
    var tX = currentLocation[0] - previousLocation[0];
    var tY = currentLocation[1] - previousLocation[1];
    return [tX, tY];
}
// calculates rotation speed
function calcRotationSpeedXY(currentLocation, previousLocation) {
    var speed = canvas.height / 10;
  
    var dx = speed * (currentLocation[0] - previousLocation[0]);
    var dy = speed * (currentLocation[1] - previousLocation[1]);
    return [dx, dy];
}
// get current location on cavas with consideration to offsets
function getCurrentLocation(event, plane_type) {
    let currentX = event.clientX;
    let currentY = event.clientY;

    let canvasHeight = canvas.height;
    let canvasWidth = canvas.width;

    var x;
    var y;

    switch(plane_type) {
        // uses center 0, 0 as origin
        case ('center-origin'):
            x = ((2*currentX) / canvasWidth) - 1
            y = (2*(canvasHeight-currentY)/canvasHeight)-1;
        break;
        // uses lower left origin for mouse click
        case ('lower-left-origin'):
            let container = canvas.getBoundingClientRect();
            // gets coordinates of mouse position relative to canvas
            let canvasRelX = currentX - container.left;
            let canvasRelY = currentY - container.top;
            x = canvasRelX;
            // flip y coordinate from top left origin to lower left origin
            y = canvasHeight - canvasRelY;

        break;
    }
    return [x, y];
}

// gets the previous rotation angle from the user's last interaction with the object 
// so it does not reset
function getRotationAngle(objID) {
    var rArray = objCurrentRxRy[objID];

    if (isDragging & mouseIsDown) {
        if (angleX != rArray[0]) {
            rArray[0] = -angleX;
        }
        if (angleY != rArray[1]) {
            rArray[1] = angleY;
        }
        rArray[2] = 0;
    }
    return rArray;
}

// multiplies the translation, scale and rotation matrix
function calcCtm(translationMat, scaleMat, rotationMat) {
    var ctm = mult(translationMat, rotationMat);
    ctm = mult(ctm, scaleMat);
    return ctm;
}

// sets the translation matrix (row major)
function calcTranslationMat(tx, ty, objID, objType) {
    var translationMat = mat4(
        1, 0.0, 0.0, tx,
        0.0, 1, 0.0, ty,
        0.0, 0.0, 1, 0.0,
        0.0, 0.0, 0.0, 1.0);
    return translationMat;
}
// sets the rotation matrix (row major)
function calcRotationMat(axisRotation) {
    var rx = rotateX(axisRotation[0]);
    var ry = rotateY(axisRotation[1]);
    var rotationMat = mult(rx, ry);

    return rotationMat;
}
// sets the scale matrix
function calcScaleMat(sc) {
    var scaleMat = mat4(
        sc, 0.0, 0.0, 0.0,
        0.0, sc, 0.0, 0.0,
        0.0, 0.0, sc, 0.0, 
        0.0, 0.0, 0.0, 1.0); 
    return scaleMat;
}