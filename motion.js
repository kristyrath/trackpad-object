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

        previousLocation[pickedObjID] = currentLocation;
        currentLocation = getCurrentLocation(event, 'center-origin');
        isDragging = true;
        // determine whether to translate or rotate the object
        if (mouseIsDown & isDragging) {
            if (translate) {
                var xyArr = calcTranlationXY(currentLocation, previousLocation[pickedObjID]);
                txFactor = xyArr[0];
                tyFactor = xyArr[1]; 
                console.log("xyArr: ", xyArr);
                console.log("txFactor: ", txFactor);
                console.log("tyFactor: ", tyFactor);
            }
            else {
                if (previousLocation[pickedObjID] == null) {
                    previousRLocation[pickedObjID] = [currentLocation[0], currentLocation[1], 0];
                }
                dragMotion(currentLocation, previousLocation, pickedObjID);

            }
        }
    })
    canvas.addEventListener('mousedown', (event) => {
        mouseIsDown = true;
        // render(); //???
        // let id = getIdFromColor(event);
        // pickedObjID = id;
        pickedObjID = document.getElementById("options").value;

    })
    canvas.addEventListener('mouseup', (event) => {
        mouseIsDown = false;
        isDragging = false;
        pickedObjID = null;
    })
    canvas.addEventListener('dblclick', (event) => {
        console.log("double clicked");
        swapColors = true;
        // let id = getIdFromColor(event);
        // pickedObjID = id;
        // changeObjColor(pickedObjID);
    })
}
function addKeyEventListener(){
    document.addEventListener('keydown', (event) => {
        if (event.key === 't' || event.key === 'T' ) {
            translate = true;
        }
    }) 
    document.addEventListener('keyup', () => {
        translate = false;
    }) 
}
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
function calcTranlationXY(currentLocation, previousLocation) {
    var tX = currentLocation[0] - previousLocation[0];
    var tY = currentLocation[1] - previousLocation[1];
    return [tX, tY];
}
function calcRotationSpeedXY(currentLocation, previousLocation) {
    var speed;
    if (translate) {
        speed = canvas.height / 60;
    }
    else {
        speed = canvas.height / 10;
    }    
    var dx = speed * (currentLocation[0] - previousLocation[0]);
    var dy = speed * (currentLocation[1] - previousLocation[1]);
    return [dx, dy];
}
function getCurrentLocation(event, plane_type) {
    let currentX = event.clientX;
    let currentY = event.clientY;

    let canvasHeight = canvas.height;
    let canvasWidth = canvas.width;

    var x;
    var y;
    switch(plane_type) {
        case ('center-origin'):
            x = ((2*currentX) / canvasWidth) - 1
            y = (2*(canvasHeight-currentY)/canvasHeight)-1;
        break;
        case ('lower-left-origin'):
            let container = canvas.getBoundingClientRect();
            // gets coordinates of mouse position relative to canvas
            let canvasRelX = currentX - container.left;
            let canvasRelY = currentY - container.top;
            // gets coordinates of 
            x = canvasRelX;
            // flip y coordinate from top left origin to lower left origin
            y = canvasHeight - canvasRelY;

        break;
    }
    return [x, y];
}

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

function calcPositionMat(translationMat, scaleMat, rotationMat, positionMat) {
    var finalPosition = mult(translationMat, positionMat);
    finalPosition = mult(finalPosition, rotationMat);
    finalPosition = mult(finalPosition, scaleMat);
    return finalPosition;
}

function calcTranslationMat(tx, ty, objID, objType) {
    var shiftX = (objID % 4)* 0.45 - 0.65 + tx;
    var shiftY = (objType-1) * -0.55 + ty;
     
    var translationMat = mat4(
        1, 0.0, 0.0, 0.0,
        0.0, 1, 0.0, 0.0,
        0.0, 0.0, 1, 0.0,
        shiftX, shiftY, 0.0, 1.0);
    return translationMat;
}
function calcRotationMat(axisRotation) {
    
    // var angles = radians(axisRotation);
    // var c = vec3(Math.cos(angles)); 
    // var s = Math.sin(angles); 
    var rx = rotateX(axisRotation);
    var ry = rotateX(axisRotation);
    var rz = rotateX(axisRotation);
    var rotationMat = mult(mult(rx * ry), rz);
    return rotationMat;
}
function calcScaleMat(sc) {
    var scaleMat = mat4(
        sc, 0.0, 0.0, 0.0,
        0.0, sc, 0.0, 0.0,
        0.0, 0.0, sc, 0.0, 
        0.0, 0.0, 0.0, 1.0); 
    return scaleMat;
}