
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
        vec3(-0.3, 0.0, -0.2),
    ];

    var vertexColors = [
        vec4(0.0, 0.0, 1.0, 1.0),  // blue
        vec4(1.0, 0.0, 1.0, 1.0),  // magenta
        vec4(0.0, 1.0, 1.0, 1.0),  // cyan
        vec4(1.0, 1.0, 1.0, 1.0)   // white
    ];

    loadVertexColors(vertexColors);
    loadVertices(vertices);
    loadIndices(tpIndices);
}