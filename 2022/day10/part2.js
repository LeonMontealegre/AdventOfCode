require("../utils");
const runProcess = require("./shared");
const fs = require("fs");

// Get all instructions
const instructions = fs
    .readFileSync("./input.txt", { encoding: "utf8" })
    .split("\n")
    .map((line) => line.split(" "));

// Run process to fill in CRT
let CRT = new Array(6*40).fill(" ");
runProcess(instructions, ({ x, cycle }) => {
    // Get current x-position of the CRT
    const crtX = (cycle-1) % 40;

    // Check if the 3-wide sprite overlaps the current CRT x-pos
    if (x-1 === crtX || x === crtX || x+1 === crtX)
        CRT[cycle-1] = "█";
});

console.log(CRT.as2DString());

// Answer is RZEKEFHA
