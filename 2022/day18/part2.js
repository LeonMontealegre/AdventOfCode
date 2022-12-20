require("../utils");
const fs = require("fs");

const file = fs.readFileSync("./input.txt", { encoding: "utf8" });

const lines = file.split("\n")
    .map((line) => line.parseNumbers());


const bounds = [[Infinity, -Infinity], [Infinity, -Infinity], [Infinity, -Infinity]];


for (let i = 0; i < lines.length; i++) {
    const cube = lines[i];

    bounds[0] = [Math.min(bounds[0][0], cube[0]), Math.max(bounds[0][1], cube[0])]
    bounds[1] = [Math.min(bounds[1][0], cube[1]), Math.max(bounds[1][1], cube[1])]
    bounds[2] = [Math.min(bounds[2][0], cube[2]), Math.max(bounds[2][1], cube[2])]
}

console.log(bounds);

const area = new Array(bounds[0][1] - bounds[0][0]+1)
    .fill(_ => new Array(bounds[1][1] - bounds[1][0]+1)
        .fill(_ => new Array(bounds[2][1] - bounds[2][0] + 1)
            .fill(false)));

console.log(area.length, area[0].length , area[0][0].length);
for (let i = 0; i < lines.length; i++) {
    const [x,y,z] = lines[i];
    area[x-bounds[0][0]][y-bounds[1][0]][z-bounds[2][0]] = true;
}

let exposedSides = lines.length * 6;

// intiial exposition
for (let i = 0; i < lines.length; i++) {
    const cube = lines[i];

    const neighbors = cube.positions.neighbors.adjacent;

    for (let j = 0; j < lines.length; j++) {
        const otherCube = lines[j];
        if (i === j)
            continue;

        if (neighbors.some((n) => n.equals(otherCube))) {
            exposedSides--;
        }
    }
}

let visited = new Set();
function floodFillCheck(pos0) {
    let positions = [pos0];
    let totalBlocks = 0;
    let totalAir = 0;

    let vis = new Set();

    while (positions.length > 0) {
        const [[x,y,z]] = positions.pop();
        // console.log(positions.length);

        if (   x < bounds[0][0] || x > bounds[0][1]
            || y < bounds[1][0] || y > bounds[1][1]
            || z < bounds[2][0] || z > bounds[2][1]) {
            // visited.set([x,y,z].join(","), [0,0]);
            return [0,0];
        }

        const part = area[x-bounds[0][0]][y-bounds[1][0]][z-bounds[2][0]];
        if (part === true) { // block
            totalBlocks++;
            continue;
        }

        if (vis.has([x,y,z].join(",")))
            continue;
        visited.add([x,y,z].join(","));
        vis.add([x,y,z].join(","));

        // in air
        totalAir++;
        const neighbours = [x,y,z].positions.neighbors.adjacent;
        for (const n of neighbours) {
            positions.push(n);
        }

    }

    // if (visited.has([x,y,z].join(",")))
    //     return visited.get([x,y,z].join(","));



    // visited.set([x,y,z].join(","), [res, "air"]);
    // return [res, "air"];
    return [totalAir, totalBlocks];
}

let total = 0;
for (let x = bounds[0][0]; x < bounds[0][1]; x++) {
    for (let y = bounds[1][0]; y < bounds[1][1]; y++) {
        for (let z = bounds[2][0]; z < bounds[2][1]; z++) {
            if (visited.has([x,y,z].join(",")))
                continue;
            const [air, blocks] = floodFillCheck([x,y,z]);
            // console.log(air, blocks);
            if (air > 0 && blocks > 0)
                total += blocks;
            // if (type === "air")
            //     total += amt;
            // total += amt;
        }
    }
}

console.log(exposedSides - total);
