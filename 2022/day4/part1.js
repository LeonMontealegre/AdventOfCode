require("../utils");
const fs = require("fs");

const result = fs
    // Read file
    .readFileSync("./input.txt", { encoding: "utf8" })
    // Split into sections
    .split("\n")
    // Split each section into pairs
    .map((section) => (
        // Split into pairs
        section.split(",")
            // Then parse out each bound for the pair
            .map((pair) => pair.split("-").asInts())
    ))
    // Then filter out the sections that are non-overlapping
    .filter(([[min1, max1], [min2, max2]]) => (
        (min1 >= min2 && max1 <= max2) ||
        (min2 >= min1 && max2 <= max1)
    ))
    // Get the number of overlapping elements
    .length;

console.log(result);

// Answer is 433
