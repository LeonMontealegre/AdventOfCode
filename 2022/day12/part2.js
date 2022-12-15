require("../utils");
const setup = require("./shared");

// Setup
const { end, graph } = setup("./input.txt");

// BFS Search backwards from `end` to nearest "0"
const path = graph.reverse().bfsSearch(end.join(","), (n) => (n === 0));

// Log length of path
console.log(path.length - 1);

// Answer is 402
