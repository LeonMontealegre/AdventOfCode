require("../utils");
const fs = require("fs");

const result = fs
    // read file
    .readFileSync("./input.txt", { encoding: "utf8" })
    // Convert to list of rucksacks
    .split("\n")
    // Split into compartments
    .map((rucksack) => rucksack.halve())
    // Find shared letters in each compartment
    .map(([a, b]) => a.intersect(b))
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

// Answer is 7795
