import {readFileSync} from "fs";
import {resolve} from "path";


function fuel(crabs: number[], targetPos: number) {
    return crabs
        .map(x => Math.abs(targetPos - x))
        .reduce((sum, cur) => sum + cur, 0);
}
function dFuel(crabs: number[], targetPos: number) {
    return crabs
        .map(x => Math.sign(targetPos - x))
        .reduce((sum, cur) => sum + cur, 0);
}


const str = readFileSync(resolve(__dirname, "./input.txt"), {encoding: "utf-8"});
const crabs = str.split(",").map(v => parseInt(v));


// This function is convex (2nd derivative is a sum of delta's which is >= 0)
//  so something like the Bisection method will converge quickly
let x0 = Math.min(...crabs), x1 = Math.max(...crabs);
for (let i = 0; i < 200; i++) {
    const y0 = dFuel(crabs, x0), y1 = dFuel(crabs, x1);
    if (y0 > 0 || y1 < 0)
        console.log("Something went wrong");
    const xh = (x1 + x0)/2, yh = dFuel(crabs, xh);
    if (yh > 0) {
        x1 = xh;
    } else if (yh < 0) {
        x0 = xh;
    } else {
        console.log("Found minimum at:", xh, "fuel:", fuel(crabs, xh));
        break;
    }
}


console.log("Found minimum at:", x0, "fuel:", fuel(crabs, x0));
console.log("or at:", x1, "fuel:", fuel(crabs, x1));

