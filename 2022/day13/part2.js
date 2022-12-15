require("../utils");
const fs = require("fs");
const compare = require("./shared");

// Load file
const packets = fs
    .readFileSync("./input.txt", { encoding: "utf8" })
    .split("\n\n")
    .flatMap((lines) => lines.split("\n"))
    .map((line) => JSON.parse(line));

// Add divider packets
packets.push([[2]], [[6]]);

// Sort packets
packets.sort((a,b) => compare(a,b));

// Find indicies of the dividers
const i = packets.findIndices(
    (a) => (compare(a, [[2]]) === 0),
    (a) => (compare(a, [[6]]) === 0)
).add(1);

// Print result
console.log(i.product());

// Answer is 21756
