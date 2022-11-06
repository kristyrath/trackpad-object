var positions = []
var colors = [];
var indices = [];
var redColor = [];
var tempColors = [];
var numPointsSquarePyramid= 18;
var numPointsTrianglePyramid= 12;
var numPointsCube= 36;
var numInstances = 2;
var canvas;
var gl;
var objType; // 0 - Square pyramid, 1 - Triangle pyramid, 2 - Cube 
var objTypeLoc;
var axisRotationLoc;
var isClicked = 0;
var cBuffer;
var vBuffer;
var program;


var tx = 0;
var ty = 0;
var txLoc;
var tyLoc;
window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");
    aspect =  canvas.width/canvas.height;

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);


    loadSquarePyramid(); 
    loadTrianglePyramid();
    loadCube();



    //  Load shaders and initialize attribute buffers

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // array element buffer
    
    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    // color array atrribute buffer

    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    // vertex array attribute buffer

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc );

    txLoc = gl.getUniformLocation(program, 'tx');
    tyLoc = gl.getUniformLocation(program, 'ty');
    objTypeLoc = gl.getUniformLocation(program, "objType");
    axisRotationLoc = gl.getUniformLocation(program, "axisRotation");
    oldThetaLoc = gl.getUniformLocation(program, "oldTheta");

    addMouseEventListeners();
    addKeyEventListener();
    render();
}


function render()
{
    console.log("TRANSLATE", translate)
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (translate & mouseIsDown & isDragging) {
        // setTranslationFactor(currentLocation, previousLocation);
        tx += txFactor;
        ty += tyFactor;
        console.log("tx", tx);
        console.log("ty", ty);
        txFactor = 0;
        tyFactor = 0;
        
    }
    else {
        setRotationAngle(currentLocation, previousLocation);

    }
  
    gl.uniform1f(txLoc, tx);
    gl.uniform1f(tyLoc, ty);
    gl.uniform3fv(axisRotationLoc, axisRotation);

    objType = 0;
    gl.uniform1i(objTypeLoc, objType);
    gl.drawElementsInstanced(gl.TRIANGLES, numPointsSquarePyramid, gl.UNSIGNED_BYTE, 0,  numInstances);

    objType = 1;
    gl.uniform1i(objTypeLoc, objType);
    gl.drawElementsInstanced(gl.TRIANGLES, numPointsTrianglePyramid, gl.UNSIGNED_BYTE, 18,  numInstances);

    objType = 2;
    gl.uniform1i(objTypeLoc, objType);
    gl.drawElementsInstanced(gl.TRIANGLES, numPointsCube, gl.UNSIGNED_BYTE, 30,  numInstances);

    requestAnimationFrame(render);
}

