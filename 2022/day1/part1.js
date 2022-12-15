require("../utils");
const fs = require("fs");

const result = fs
    // Read file
    .readFileSync("./input.txt", { encoding: "utf8" })
    // Split into calorie groups
    .split("\n\n")
    // Map each group into the total calories
    .map((group) => (
        group.split("\n")
            // Map into integers
            .map((cal) => parseInt(cal)))
            // Sum
            .sum()
    );

// Print max-calorie elf
console.log(Math.max(...result));

// Answer is 69912
