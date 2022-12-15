require("../utils");
const setup = require("./shared");

// Setup
const { start, end, graph } = setup("./input.txt");

// BFS Search for shortest-path
const path = graph.bfsSearch(start.join(","), end.join(","));

// Log length of path
console.log(path.length - 1);

// Answer is 412
