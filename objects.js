
function loadSquarePyramid(numElements) {
    var vertices = [
        vec3(0.0, 0.7, 0.0),
        vec3(0.5, 0.0, 0.5),
        vec3(0.5, 0.0, -0.5),
        vec3(-0.5, 0.0, -0.5),
        vec3(-0.5, 0.0, 0.5)
    ];
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
    var sqIndices = [
        0, 1, 2,
        2, 3, 0,
        3, 0, 4,
        1, 0, 4,
        4, 2, 3,
        4, 1, 2
    ];
    var numVert = vertices.length;
    loadVertexColors(vertexColors);
    loadVertices(vertices);
    loadIndices(sqIndices, numVert);
}


function loadTrianglePyramid(numElements) {
    var tpIndices = [
        0, 1, 2, 
        2, 3, 0, 
        3, 0, 1, 
        1, 2, 3
    ];
    var vertices = [
        vec3(0.0, 0.4, 0.0),
        vec3(0.0, 0.0, 0.3),
        vec3(0.3, 0.0, -0.2),
        vec3(-0.3, 0.0, -0.2)
    ];

    var vertexColors = [
        vec4(0.0, 0.0, 1.0, 1.0),  // blue
        vec4(1.0, 0.0, 1.0, 1.0),  // magenta
        vec4(0.0, 1.0, 1.0, 1.0),  // cyan
        vec4(1.0, 1.0, 1.0, 1.0)   // white
    ];

    var numVert = vertices.length;
    loadVertexColors(vertexColors);
    loadVertices(vertices);
    loadIndices(tpIndices, numVert);
}

function loadCube(numElements) {
    var vertices = [
        vec3(-0.5, -0.5,  0.5),
        vec3(-0.5,  0.5,  0.5),
        vec3(0.5,  0.5,  0.5),
        vec3(0.5, -0.5,  0.5),
        vec3(-0.5, -0.5, -0.5),
        vec3(-0.5,  0.5, -0.5),
        vec3(0.5,  0.5, -0.5),
        vec3(0.5, -0.5, -0.5)
    ];
    
    var vertexColors = [
        vec4(0.0, 0.0, 0.0, 1.0),  // black
        vec4(1.0, 0.0, 0.0, 1.0),  // red
        vec4(1.0, 1.0, 0.0, 1.0),  // yellow
        vec4(0.0, 1.0, 0.0, 1.0),  // green
        vec4(0.0, 0.0, 1.0, 1.0),  // blue
        vec4(1.0, 0.0, 1.0, 1.0),  // magenta
        vec4(1.0, 1.0, 1.0, 1.0),  // white
        vec4(0.0, 1.0, 1.0, 1.0)   // cyan
    ];

    var cIndices = [

        1, 0, 3,
        1, 3, 2,
        2, 3, 7, 
        2, 7, 6,
        3, 0, 4,
        3, 4, 7, 
        6, 5, 1,
        6, 1, 2,
        4, 5, 6, 
        4, 6, 7, 
        5, 4, 0,
        5, 0, 1
    ];

    var numVert = vertices.length;

    loadVertexColors(vertexColors);
    loadVertices(vertices);
    loadIndices(cIndices, numVert);
}

function loadVertexColors(objVertexColors, numElements) {
    for ( var i = 0; i < objVertexColors.length; ++i ) {
        if(currentProgram === mainProgram) {
            colors.push( objVertexColors[i]);
        }
        else {
            colors.push(vec4(1.0, 0.0, 0.0, 1.0));
        }
    }
    
}

function loadVertices(objVertices) {
    for ( var i = 0; i < objVertices.length; ++i ) {
        positions.push( objVertices[i]);
    }

}
function loadIndices(objIndices, objNumVertices) {
    if (positions) {
        var lastIndex = 0;
        if (indices.length != 0) {
            lastIndex = objNumVertices + 1;
        }
        for (var j = 0; j < objIndices.length; ++j) {            
            indices.push(lastIndex + objIndices[j]);
        }
    } 
    else {
        console.log("ERROR: LOAD VERTICES FIRST.");
    }
}
