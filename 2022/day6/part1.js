require("../utils");
const fs = require("fs");

const MARKER_LEN = 4;
const result = fs
    // Read file
    .readFileSync("./input.txt", { encoding: "utf8" })
    // Split by character into an array
    .split("")
    // Find index of marker
    .findIndex((_, i, arr) => (
        // Which is where the last 4 characters are unique
        new Set(arr.slice(i+1-MARKER_LEN, i+1)).size === MARKER_LEN
    ))
    // Add 1 to mark position
    + 1;

console.log(result);

// Answer is 1779
