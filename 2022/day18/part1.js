require("../utils");
const fs = require("fs");

const file = fs.readFileSync("./input.txt", { encoding: "utf8" });

const lines = file.split("\n")
    .map((line) => line.parseNumbers());

let exposedSides = lines.length * 6;

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
    // console.log(line);
}

console.log(exposedSides);
