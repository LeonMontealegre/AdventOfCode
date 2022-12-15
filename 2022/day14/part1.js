require("../utils");
const setup = require("./shared");

const { grid, getBounds } = setup("./input.txt");


function getNextSandPos([x, y]) {
    if (!grid.has([x, y+1])) // Check down
        return [x, y+1];
    else if (!grid.has([x-1, y+1])) // Check bottom-left
        return [x-1, y+1];
    else if (!grid.has([x+1, y+1])) // Check bottom-right
        return [x+1, y+1];
    else // Else stay in same position
        return [x, y];
}

function simSand() {
    // Set initial sand position
    let pos = [500, 0], nextPos;

    // Loop until the sand stops moving
    while (!(nextPos = getNextSandPos(pos)).equals(pos)) {
        pos = nextPos;
        if (pos[1] > floor) // Return if we're in the abyss
            return false;
    }

    // Stop if the sand hasn't moved at all
    if (pos.equals([500, 0]))
        return false;

    // Set sand pos on grid and return true
    grid.set(pos, "o");
    return true;
}

// Floor to which the sand is in the "abyss"
const floor = getBounds().maxY + 1;

let count = 0;
while (simSand())
    count++;

console.log(count);

// Answer is 838
