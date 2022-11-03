"use strict";

var canvas;
var gl;

// var numPositions  = 36;
var numPositions = 18;
var clockwise = false; 
var counterClockwise = true;
var uScaleLoc;
var uScale = 1;
var scaleUp = true;
var scaleDown = false;
var positions = [];
var colors = [];
var axis = 1; // 0 for x, 1 for y, 2 for z

var axisRotation = [0, 0, 0];
var axisRotationLoc;

var u_time = 0.0;
var uTimeLoc;
init();

function init()
{
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    colorTriangularPyramid();
    console.log(positions);
    console.log(colors);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    axisRotationLoc = gl.getUniformLocation(program, "axisRotation");
    uScaleLoc = gl.getUniformLocation(program, "uScale");


    render();
}

function colorTriangularPyramid()
{

    triangle(0, 1, 2);
    triangle(2, 3, 0);
    triangle(3, 0, 4);
    triangle(1, 0, 4);
    triangle(4, 2, 3);
    triangle(4, 1, 2);




}

function triangle(a, b, c)
{
    var vertices = [
        vec4(0.0, 0.7, 0.0, 1.0),
        vec4(0.5, 0.0, 0.5, 1.0),
        vec4(0.5, 0.0, -0.5, 1.0),
        vec4(-0.5, 0.0, -0.5, 1.0),
        vec4(-0.5, 0.0, 0.5, 1.0)


        // bottom


    ];

    //vertex color assigned by the index of the vertex
    // var indices = [a, b, c, a, c, d]; ???
    var indices = [a, b, c];
    //You'll want some different colours in here

    var green = vec4(0.0, 1.0, 0.0, 1.0);  
    var vertexColors = [
        vec4(0.0, 0.0, 0.0, 1.0),  // black
        vec4(1.0, 0.0, 0.0, 1.0),  // red
        vec4(1.0, 1.0, 0.0, 1.0),  // yellow
        vec4(0.0, 1.0, 0.0, 1.0),  // green
        vec4(0.0, 0.0, 1.0, 1.0),  // blue
        vec4(1.0, 0.0, 1.0, 1.0),  // magenta
        vec4(0.0, 1.0, 1.0, 1.0),  // cyan
        vec4(1.0, 1.0, 1.0, 1.0)   // white
    ];

  

    for ( var i = 0; i < indices.length; ++i ) {
        positions.push( vertices[indices[i]] );
        // colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        colors.push(vertexColors[a]);
    }

}
document.getElementById("rotateClockwiseButton").onclick = () => { 
    clockwise = true;
    counterClockwise = false;
}
document.getElementById("rotateCounterClockwiseButton").onclick = () => { 
    clockwise = false;
    counterClockwise = true;
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //I used 0.25 since it was tolerable on my machine, there's no other reason for it
    if (clockwise) {
        axisRotation[axis] += 0.9;
    }
    else {
        axisRotation[axis] -= 0.9;
    }

    gl.uniform3fv(axisRotationLoc, axisRotation);




    // ADJUST SCALE ONCE MINIMUM MAX (-50%) OR MAX (+50%) IS MET
    if (uScale <= 0.5) {
        scaleUp = true;
        scaleDown = false;
    }
    else if (uScale >= 1.5) {
        scaleUp = false; 
        scaleDown = true;
    }
    // scale up or scale down
    if (scaleUp) {
        uScale += 0.01;
    }
    else {
        uScale -= 0.01;
    }
    gl.uniform1f(uScaleLoc, uScale);
    gl.drawArrays(gl.TRIANGLES  , 0, numPositions);
    requestAnimationFrame(render);
  
  
}
