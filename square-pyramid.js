
function loadSquarePyramid() {
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
    
    loadVertexColors(vertexColors);
    loadVertices(vertices);
    loadIndices(sqIndices);
}

