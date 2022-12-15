require("../utils");
const fs = require("fs");

const result = fs
    .readFileSync("./input.txt", { encoding: "utf8" })
    .parseNumGrid()
    .mapN((curTree, i, j, trees) => (
        trees.dirs.some((dir) => (
            Array.from(trees.walk(dir, i, j))
                .slice(1)
                .every((otherTree) => (otherTree < curTree))
        ))
    ))
    .sum();

console.log(result);

// Answer is 1818
