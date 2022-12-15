require("../utils");
const fs = require("fs");

const result = fs
    .readFileSync("./input.txt", { encoding: "utf8" })
    .parseNumGrid()
    .mapN((curTree, i, j, trees) => (
        trees.dirs.map((dir) => (
            Array.from(trees
                .walk(dir, i, j)
                .until((otherTree) => (otherTree >= curTree))
            ).length - 1
        ))
        .product()
    ))
    .max();

console.log(result);

// Answer is 368368
