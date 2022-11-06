var axisRotation = [0, 0, 0];

var axisTranslationLoc;
var newX = 0.3;
var newY = 0.3;

var currentLocation;
var previousLocation; 

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

var txFactor;
var tyFactor;
function addMouseEventListeners() {
    
    canvas.addEventListener('mousemove', (event) => {

        previousLocation = currentLocation;
        currentLocation = getCurrentLocation(event);
        isDragging = true;
        // determine whether to translate or rotate the object
        if (mouseIsDown & isDragging) {
            if (translate) {
                var xyArr = calcTranlationXY(currentLocation, previousLocation);
                txFactor = xyArr[0];
                tyFactor = xyArr[1]; 
                // console.log("txFactor: ", txFactor);
                // console.log("tyFactor: ", tyFactor);
            }
            else {
                dragMotion(currentLocation, previousLocation);
            }
        }
    })
    canvas.addEventListener('mousedown', (event) => {
        mouseIsDown = true;
        var pixels = new Uint8Array(4);
        selectPixel(event);
    })
    canvas.addEventListener('mouseup', (event) => {
        mouseIsDown = false;
        isDragging = false;
    })
}
function addKeyEventListener(){
    document.addEventListener('keydown', (event) => {
        if (event.key === 't') {
            translate = true;
        }
    }) 
    document.addEventListener('keyup', () => {
        translate = false;
    }) 
}
function dragMotion(currentLocation, previousLocation) {
    previousAngleX = angleX;
    previousAngleY = angleY;
    // // calculate distance
    // var normalVec = [currentLocation[0] - previousLocation[0], currentLocation[1] - previousLocation[1]];
    newX = currentLocation[0];
    newY = currentLocation[1];

    // calc speed of rotation 
    var axisSpeed = calcRotationSpeedXY(currentLocation, previousLocation);
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
function getCurrentLocation(event) {
    let currentX = event.clientX;
    let currentY = event.clientY;


    let canvasHeight = canvas.height;
    let canvasWidth = canvas.width;

    // ???
    var x = ((2*currentX) / canvasWidth) - 1
    var y = (2*(canvasHeight-currentY)/canvasHeight)-1;

    return [x, y];
    
}

function setRotationAngle(currentLocation, previousLocation) {
    if (isDragging & mouseIsDown) {
        if (angleX != previousAngleX) {
            axisRotation[0] = -angleX;
        }
        if (angleY != previousAngleY) {
            axisRotation[1] = angleY;
        }
    }
}
// function setTranslationFactor(currentLocation, previousLocation) {
//     if (isDragging & mouseIsDown & translate) {
//         let xy = calcTranlationXY(currentLocation, previousLocation);
//         tx = xy[0];
//         ty = xy[1];
//         console.log("tx: ", tx);
//         console.log("ty: ", ty);
//     }
// }

function selectPixel(event) {
    var coord = getCurrentLocation(event);
    var RGBA = new window.Uint8Array(4); 
    gl.readPixels(coord[0], coord[1], 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, RGBA);
}

