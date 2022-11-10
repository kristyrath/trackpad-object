
function loadSquarePyramid() {
    var vertices = [
        vec3(0.0, 0.7, 0.0),
        vec3(0.5, 0.0, 0.5),
        vec3(0.5, 0.0, -0.5),
        vec3(-0.5, 0.0, -0.5),
        vec3(-0.5, 0.0, 0.5)
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
    loadVertexColors(colorList[3], 5, 0); // l
    loadVertices(vertices);
    loadIndices(sqIndices, numVert);
}


function loadTrianglePyramid() {
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

    var numVert = vertices.length;
    loadVertexColors(colorList[2], 9, 4);
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

    loadVertexColors(colorList[1], 17, 9);
    loadVertices(vertices);
    loadIndices(cIndices, numVert);
}

function loadVertexColors(objVertexColors, numVertexColors, offset) {
    let j = 0;
    for (var i = offset; i < numVertexColors; ++i ) {
        colors[i] = objVertexColors[j];
        j++;
        // if(currentProgram === mainProgram) {
        //     colors.push( objVertexColors[i]);
        // }

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




