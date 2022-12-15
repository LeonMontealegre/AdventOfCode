require("../utils");
const parseInput = require("./shared");

const motions = parseInput("input.txt");

let tailPos = [0,0], headPos = [0,0];
const allPositions = motions
    .flatMap(([dir, amt]) => new Array(amt).fill(_ => {
        // Move head
        headPos = headPos.add(dir);

        // Check if tail is in the neighborhood of the head
        if (!tailPos.isNeighborsWith(headPos))
            tailPos = tailPos.add(tailPos.dirTo(headPos).snap());

        return tailPos.join(",");
    }))
    .unique();

console.log(allPositions.length);

// Answer is 6314
