require("../utils");
const setup = require("./shared");

const { grid, getBounds } = setup("./input.txt");

function getNextSandPos([x, y]) {
    if (!grid.has([x, y+1]) && y+1 < floor) // Check down
        return [x, y+1];
    else if (!grid.has([x-1, y+1]) && y+1 < floor) // Check bottom-left
        return [x-1, y+1];
    else if (!grid.has([x+1, y+1]) && y+1 < floor) // Check bottom-right
        return [x+1, y+1];
    else // Else stay in same position
        return [x, y];
}

function simSand() {
    // Set initial sand position
    let pos = [500, 0], nextPos;

    // Loop until the sand stops moving
    while (!(nextPos = getNextSandPos(pos)).equals(pos))
        pos = nextPos;

    // Stop if the sand hasn't moved at all
    if (grid.has(pos))
        return false;

    // Set sand pos on grid and return true
    grid.set(pos, "o");
    return true;
}

// Floor to which the sand is in the "abyss"
const floor = getBounds().maxY + 2;

let count = 0;
while (simSand())
    count++;

console.log(count);

// Answer is 27539
