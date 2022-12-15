import {readFileSync} from "fs";
import {resolve} from "path";


function getNeighbors(heights: number[][], row: number, col: number): number[] {
    let pts = [] as number[];
    if (row-1 >= 0)                pts.push(heights[row-1][col]);
    if (row+1 < heights.length)    pts.push(heights[row+1][col]);
    if (col-1 >= 0)                pts.push(heights[row][col-1]);
    if (col+1 < heights[0].length) pts.push(heights[row][col+1]);
    return pts;
}

const str = readFileSync(resolve(__dirname, "./input.txt"), {encoding: "utf-8"});
const heights = str.split("\n").map(line => line.split("").map(v => parseInt(v)));

const pts: [number, number][] = [];
for (let row = 0; row < heights.length; row++) {
    for (let col = 0; col < heights[row].length; col++) {
        const neighbors = getNeighbors(heights, row, col);
        if (neighbors.every(h => heights[row][col] < h))
            pts.push([row, col]);
    }
}

console.log(pts.length);
console.log(pts.reduce((sum, [row, col]) => sum + heights[row][col] + 1, 0));
