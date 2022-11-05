// function useSelectorProgram() {

//     gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//     program = initShaders(gl, 'vertex-shader', 'fragment-shader');
//     gl.useProgram(pixelSelectorProgram);

//     cBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);

//     vBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

// }
// function useCanvasProgram() {

// }
// function selectProgram() {
//     if (gl.getParameter(gl.CURRENT_PROGRAM) == select_program) {
//         useSelectorProgram();
//       } else {
//         useCanvasProgram();
//       }
// }
