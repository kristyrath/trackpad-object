
// loads each shape by their correspondign vertices, indices and colors
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

// loads vertex colors into array linked to the color attribute
function loadVertexColors(objVertexColors, numVertexColors, offset) {
    let j = 0;
    for (var i = offset; i < numVertexColors; ++i ) {
        colors[i] = objVertexColors[j];
        j++;
    }
}

// loads vertices into array linked to the vertex buffer
function loadVertices(objVertices) {
    for ( var i = 0; i < objVertices.length; ++i ) {
        positions.push( objVertices[i]);
    }

}

// loads indices colors into array linked to the index buffer
// index is used for vertex color selection
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








var colorList = [
    // yellow color
    [
        vec4(1.0, 1.0, 0.0, 1.0),   
        vec4(0.82, 0.83, 0.12, 1.0),  
        vec4(0.94, 0.95, 0.23, 1.0),   
        vec4(0.72, 0.7, 0.37, 1.0),  
        vec4(0.36, 0.64, 0.48, 1.0),  
        vec4(0.93, 0.92, 0.22, 1.0),   
        vec4(0.65, 0.64, 0.41, 1.0),  
        vec4(1.0, 1.0, 0.0, 1.0)
    ],
    [
        // purple color
        vec4(0.9, 0.18, 1.0, 1.0),   
        vec4(0.0, 0.23, 0.98, 1.0),  
        vec4(0.0, 0.31, 0.81, 1.0),   
        vec4(0.0, 0.44, 0.72, 1.0),  
        vec4(0.0, 0.55, 0.66, 1.0),
        vec4(0.0, 0.22, 0.93, 1.0),  
        vec4(0.0, 0.3, 0.84, 1.0),   
        vec4(0.0, 0.2, 0.93, 1.0),  
    ],
    [
        // green
        vec4(0.0, 0.53, 0.51, 1.0), 
        vec4(0.0, 0.44, 0.43, 1.0), 
        vec4(0.0, 0.37, 0.34, 1.0), 
        vec4(0.0, 0.22, 0.26, 1.0), 
        vec4(0.0, 0.44, 0.43, 1.0), 
        vec4(0.0, 0.37, 0.34, 1.0),  
        vec4(0.0, 0.22, 0.26, 1.0),    
        vec4(0.0, 0.44, 0.43, 1.0)
    ],
    // red color
    [
        vec4(0.63, 0.0, 0.0, 1.0), 
        vec4(0.52, 0.0, 0.0, 1.0), 
        vec4(0.43, 0.0, 0.0, 1.0), 
        vec4(0.31, 0.0, 0.0, 1.0), 
        vec4(1.0, 0.0, 0.0, 1.0),  
        vec4(0.95, 0.0, 0.0, 1.0), 
        vec4(0.86, 0.0, 0.0, 1.0), 
        vec4(0.71, 0.0, 0.0, 1.0), 
    ],
    // blue color
    [
        vec4(0.0, 0.0, 1.0, 1.0),   
        vec4(0.0, 0.1, 0.98, 1.0),  
        vec4(0.0, 0.0, 0.81, 1.0),   
        vec4(0.0, 0.0, 0.72, 1.0),  
        vec4(0.0, 0.2, 0.16, 1.0),
        vec4(0.1, 0.0, 0.93, 1.0),  
        vec4(0.0, 0.0, 0.84, 1.0),   
        vec4(0.0, 0.4, 0.3, 1.0)
    ],
    // bright green color
    [
        vec4(0.0, 0.53, 0.00, 1.0), 
        vec4(0.0, 0.44, 0.00, 1.0), 
        vec4(0.0, 0.37, 0.00, 1.0), 
        vec4(0.0, 0.22, 0.00, 1.0), 
        vec4(0.0, 0.44, 0.00, 1.0), 
        vec4(0.0, 0.37, 0.00, 1.0),  
        vec4(0.0, 0.22, 0.00, 1.0),    
        vec4(0.0, 0.44, 0.00, 1.0)
    ],
    [
    // pink color
        vec4(1.00, 0.00, 1.00, 1.0), 
        vec4(0.82, 0.00, 0.82, 1.0), 
        vec4(0.94, 0.00, 0.94, 1.0), 
        vec4(0.72, 0.00, 0.72, 1.0), 
        vec4(0.36, 0.00, 0.36, 1.0), 
        vec4(0.93, 0.00, 0.93, 1.0),  
        vec4(0.65, 0.00, 0.65, 1.0),    
        vec4(1.00, 0.00, 1.00, 1.0),   
    ],
    // light maroon color
    [
        vec4(0.70, 0.00, 0.00, 0.7), 
        vec4(0.82, 0.00, 0.00, 0.4), 
        vec4(0.81, 0.00, 0.00, 0.5), 
        vec4(0.92, 0.00, 0.00, 0.6), 
        vec4(0.91, 0.00, 0.00, 0.3), 
        vec4(0.99, 0.00, 0.00, 0.8),  
        vec4(0.77, 0.00, 0.00, 0.8),    
        vec4(1.00, 0.00, 0.00, 0.9),   
    ]
];
    