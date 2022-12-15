require("../utils");
const fs = require("fs");

const [cratesFile, movesFile] = fs
    // Read file
    .readFileSync("./input.txt", { encoding: "utf8" })
    // Split file into two parts for crate setup and moves
    .split("\n\n");

// Parse crates into array of each column with [0] being the bottom crate
const crates = cratesFile
    // Split out the bottom row
    .splitLast()[0]
    // Parse into a fixed grid with delimeter "[x]"
    .parseFixedGrid("[x]", { spacer: " " })
    // Turn grid into stacks by transposing and reversing each column
    .asStacks()
    // Trim " " off the tops of each column since they are blanks
    .trimTops(" ");

// Parse moves
const moves = movesFile
    // Split file line-by-line
    .split("\n")
    .map((line) => line.parseNumbers());

// Apply each move
moves.forEach(([amt, from, to]) => (
    // Push the crates pop'd from the previous crates
    crates[to-1].push(...crates[from-1].pop(amt))
));

// Get final crate-tops
const result = crates.map((crate) => crate.top()).join("");

console.log(result);

// Answer is QPJPLMNNR
