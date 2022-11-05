var axisRotation = [0, 0, 0];
var axisRotationLoc;
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

function addMouseEventListeners() {
    canvas.addEventListener('mousemove', (event) => {
        previousLocation = currentLocation;
        currentLocation = getCurrentLocation(event);
        isDragging = true;
        if (mouseIsDown & isDragging) {
            dragMotion(currentLocation);
        }
    })
    canvas.addEventListener('mousedown', (event) => {
        mouseIsDown = true;
    })
    canvas.addEventListener('mouseup', (event) => {
        mouseIsDown = false;
        isDragging = false;
    })
}

function dragMotion(currentLocation) {
    previousAngleX = angleX;
    previousAngleY = angleY;
    // // calculate distance
    // var normalVec = [currentLocation[0] - previousLocation[0], currentLocation[1] - previousLocation[1]];
    newX = currentLocation[0];
    newY = currentLocation[1];

    // calc speed of rotation 
    var speed = canvas.height / 10;
    var dx = speed * (currentLocation[0] - previousLocation[0]);
    var dy = speed * (currentLocation[1] - previousLocation[1]);

    // calc angle of rotation 
    
    angleX = angleX + dy;
    angleY = angleY + dx;
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

function setRotationAngle() {
    if (isDragging & mouseIsDown) {
        // console.log(currentLocation);
        // console.log(previousLocation);

        if (angleX != previousAngleX) {
            axisRotation[0] = -angleX;
        }
        if (angleY != previousAngleY) {
            axisRotation[1] = angleY;
        }

    }
}