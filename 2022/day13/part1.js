require("../utils");
const fs = require("fs");
const compare = require("./shared");

// Load file
const packets = fs
    .readFileSync("./input.txt", { encoding: "utf8" })
    .split("\n\n")
    .map((lines) => lines.split("\n")
        .map((line) => JSON.parse(line)));

// Calculate result
const result = packets
    // Check if each pair has left first already
    .map(([left, right]) => (compare(left, right) < 0))
    // Then if so, map to their index
    .map((correct, i) => (correct ? (i+1) : (0)))
    // Sum the indices
    .sum();

// Print result
console.log(result);

// Answer is 5506
