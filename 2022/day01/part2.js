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
    )
    // Sort the array
    .sort((a, b) => (b - a))
    // Get top 3
    .slice(0, 3)
    // Sum
    .sum();

console.log(result);

// Answer is 208180
