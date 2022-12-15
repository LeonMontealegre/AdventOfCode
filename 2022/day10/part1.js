require("../utils");
const runProcess = require("./shared");
const fs = require("fs");

// Get all instructions
const instructions = fs
    .readFileSync("./input.txt", { encoding: "utf8" })
    .split("\n")
    .map((line) => line.split(" "));

// Run process and calculate strengths every 40 cycles
let strengths = [];
runProcess(instructions, ({ x, cycle }) => {
    // Get signal strength every 40 cycles
    if ((cycle - 20) % 40 !== 0)
        return;
    strengths.push(x * cycle);
});

console.log(strengths.sum());

// Answer is 14820
