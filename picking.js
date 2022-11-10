// var gradientFactor = 1/255;

// function setRedColor() {

//     if (positions.length != 0) {

//         tempColors = colors;
//         colors = [];
//         for(var i = 0; i < positions.length; i++) {
//             colors.push(vec4(1.0, 0.0, 0.0, 1.0));
//         }
//     }  
// }

// function getIdFromColor(event) {
//     var coord = getCurrentLocation(event, 'lower-left-origin');
//     console.log("COORDINATES LL: ", coord);
//     var RGBA = new Uint8Array(4); 
//     gl.readPixels(coord[0], coord[1], 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, RGBA);
//     console.log(RGBA);
//     console.log("RED VALUE", RGBA[0]);
//     // float(id) * 30.0 / 255.0;
//     let id = RGBA[0];
//     console.log("id", id);
//     return id;
// }

