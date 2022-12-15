const fs = require("fs");

const dDir = {
    "R": [1, 0],
    "L": [-1, 0],
    "U": [0, 1],
    "D": [0, -1],
};

module.exports = function parseInput(file) {
    return fs
        .readFileSync("./input.txt", { encoding: "utf8" })
        .split("\n")
        .map((line) => line.split(" "))
        .map(([dir, amt]) => [dDir[dir], parseInt(amt)]);
}
