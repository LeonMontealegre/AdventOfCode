require("../utils");
const fs = require("fs");

const result = fs
    // Read file
    .readFileSync("./input.txt", { encoding: "utf8" })
    // Convert to list of rucksacks
    .split("\n")
    // Group in segments of 3
    .groupBy(3)
    // Intersect each group to get common letters
    .map(([r1, r2, r3]) => r1.intersect(r2, r3))
    // Calculate points from each letter
    .map(([letter]) => (
        letter.toCode() - (
            letter.isUpperCase()
            ? ("A".toCode() - 27)
            : ("a".toCode() - 1)
        )
    ))
    .sum();

console.log(result);

// Answer is 2703
