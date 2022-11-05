var positions = []
var colors = []
var indices = [];
var numElements = 18;
var numInstances = 10;
var canvas;
var gl;


var axisRotationLoc;
window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");
    aspect =  canvas.width/canvas.height;

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    loadSquarePyramid(); 
    loadTrianglePyramid();
    // loadCube(); 

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);;

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // array element buffer
    
    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    // color array atrribute buffer

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    // vertex array attribute buffer

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc );

    axisRotationLoc = gl.getUniformLocation(program, "axisRotation");
    oldThetaLoc = gl.getUniformLocation(program, "oldTheta");
    //event listeners for buttons

    addMouseEventListeners();
    render();
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    setRotationAngle();
    gl.uniform3fv(axisRotationLoc, axisRotation);
    gl.drawElementsInstanced(gl.TRIANGLES, numElements, gl.UNSIGNED_BYTE, 0,  numInstances);

    requestAnimationFrame(render);

}


function loadVertexColors(objVertexColors) {
    for ( var i = 0; i < objVertexColors.length; ++i ) {
        // var randIndex = Math.floor(Math.random() * objVertexColors.length);
        // console.log(randIndex)
        colors.push( objVertexColors[i] );
    }
    
}

function loadVertices(objVertices) {
    for ( var i = 0; i < objVertices.length; ++i ) {
        positions.push( objVertices[i]);
    }

}
function loadIndices(objIndices) {
    for (var j = 0; j < objIndices.length; ++j) {
        indices.push(objIndices[j]);
    }
}