import {readFileSync} from "fs";
import {resolve} from "path";


function getNeighbors(heights: number[][], row: number, col: number): [number,number,number][] {
    let pts = [] as [number, number, number][];
    if (row-1 >= 0)                pts.push([row-1, col, heights[row-1][col]]);
    if (row+1 < heights.length)    pts.push([row+1, col, heights[row+1][col]]);
    if (col-1 >= 0)                pts.push([row, col-1, heights[row][col-1]]);
    if (col+1 < heights[0].length) pts.push([row, col+1, heights[row][col+1]]);
    return pts;
}
function floodGather(heights: number[][], row: number, col: number, set: Set<`${number},${number}`>) {
    if (heights[row][col] === 9) // Wall
        return;

    const key = `${row},${col}` as const;
    if (set.has(key))
        return;
    set.add(key);
    getNeighbors(heights, row, col).forEach(([r, c]) => {
        floodGather(heights, r, c, set);
    });
}

const str = readFileSync(resolve(__dirname, "./input.txt"), {encoding: "utf-8"});
const heights = str.split("\n").map(line => line.split("").map(v => parseInt(v)));

// Find lowest points
const pts: [number, number][] = [];
for (let row = 0; row < heights.length; row++) {
    for (let col = 0; col < heights[row].length; col++) {
        const neighbors = getNeighbors(heights, row, col);
        if (neighbors.every(([_,__,h]) => heights[row][col] < h))
            pts.push([row, col]);
    }
}

// Start basins with all the lowest points
const basins = [] as Set<`${number},${number}`>[];

for (const [row,col] of pts) {
    const set = new Set<`${number},${number}`>();
    floodGather(heights,row,col,set);
    basins.push(set);
}

const sizes = basins.map(b => b.size);
sizes.sort((a, b) => a - b);

console.log(sizes);

const output = sizes.slice(-3).reduce((sum, cur) => sum * cur, 1);

console.log(output);