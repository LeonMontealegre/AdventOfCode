require("../utils");
const fs = require("fs");

const file = fs.readFileSync("./input.txt", { encoding: "utf8" });

const readings = file.split("\n")
    .map((line) => line.parseNumbers());

const max = 4000000;

const dists = [];

for (let i = 0; i < readings.length; i++) {
    const [x0, y0, x1, y1] = readings[i];
    const dist = Math.abs(x1 - x0) + Math.abs(y1 - y0);
    dists.push([x0, y0, dist]);
}

function isInSensorI(i, x, y) {
    const [x0, y0, dist] = dists[i];
    if (Math.abs(x - x0) + Math.abs(y - y0) <= dist)
        return true;
    return false;
}
function isInSensor(x, y) {
    if (x < 0 || y < 0 || x >= max || y >= max)
        return true;
    for (let i = 0; i < dists.length; i++) {
        if (isInSensorI(i, x, y))
            return true;
    }
    return false;
}

// for (let x = 0; x <= max; x++) {
//     for (let y = 0; y <= max; y++) {

//         if (!isInSensor(x, y)) {
//             console.log(x, y, 4000000*x + y);
//             return;
//         }

//     }

// }

// attempt 2
for (let i = 0; i < readings.length; i++) {
    // let i = 6;
    const [x0, y0, dist] = dists[i];

    // walk around sensor
    for (let dx = -dist-1, dy = 0; dx <= 0; dx++, dy++) {

        { // check top
            let x = x0 + dx;
            let y = y0 + dy;
            if (!isInSensor(x, y)) {
                console.log("FOUND", x, y, x * 4000000 + y);
                return;
            }

        }
        { // check bottom
            let x = x0 + dx;
            let y = y0 - dy;
            if (!isInSensor(x, y)) {
                console.log("FOUND", x, y, x * 4000000 + y);
                return;
            }

        }
    }
    for (let dx = 0, dy = dist+1; dx <= dist+1; dx++, dy--) {

        { // check top
            let x = x0 + dx;
            let y = y0 + dy;
            if (!isInSensor(x, y)) {
                console.log("FOUND", x, y, x * 4000000 + y);
                return;
            }

        }
        { // check bottom
            let x = x0 + dx;
            let y = y0 - dy;
            // console.log(x,y);
            if (!isInSensor(x, y)) {
                console.log("FOUND", x, y, x * 4000000 + y);
                return;
            }

        }
    }
}
// for (let i = 0; i < readings.length; i++) {
//     for (let j = 0; j < readings.length; j++) {
//         for (let k = 0; k < readings.length; k++) {

//             const [xi, yi] = dists[i];
//             const [xj, yj] = dists[j];
//             const [xk, yk] = dists[k];

//             const xx = (xi + xj + xk) / 3;
//             const yy = (yi + yj + yk) / 3;

//             const res = testArea(i,j,k,xx,yy);
//             if (res === false) {
//                 continue;
//             }

//             console.log("FOUND", res);
//             return;
//         }
//     }
// }




// for (let y = 0; y <= max; y++) {
//     const no = new Set();

//     for (let i = 0; i < readings.length; i++) {
//         const [x0, y0, x1, y1] = readings[i];

//         const dist = Math.abs(x1 - x0) + Math.abs(y1 - y0);

//         console.log(i, x0, y0, x1, y1, dist);

//         const dy = Math.abs(y - y0);
//         const dx = Math.abs(dist - dy);

//         const xx0 = x0 - (dx*2);
//         const xx1 = x0 + (dx*2);

//         for (let x = xx0; x <= xx1; x++) {
//             if (Math.abs(x - x0) + dy > dist)
//                 no.add(x);
//         }
//     }

// }

// console.log(no.size - 1);
