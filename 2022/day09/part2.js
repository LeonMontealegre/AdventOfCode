require("../utils");
const parseInput = require("./shared");

const motions = parseInput("input.txt");

let positions = new Array(10).fill(_ => [0,0]);
const allPositions = motions
    .flatMap(([dir, amt]) => new Array(amt).fill(_ => {
        // Move head
        positions[0] = positions[0].add(dir);

        // Move each successive part of the rope
        positions.reduce((prevPos, pos, p) => {
            // Check if pos is in the neighborhood of the prev position
            if (!pos.isNeighborsWith(prevPos))
                positions[p] = pos.add(pos.dirTo(prevPos).snap());
            return positions[p];
        });

        return positions.last().join(",");
    }))
    .unique();

console.log(allPositions.length);

// Answer is 2504
