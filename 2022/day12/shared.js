const fs = require("fs");

module.exports = function setup(file) {
    // Load grid from file
    const grid = fs
        .readFileSync(file, { encoding: "utf8" })
        .parseFixedGrid();

    // Find start/end positions
    const [start, end] = grid.findIndices((val) => (val === "S"), (val) => (val === "E"));

    // Convert grid to numbers and then to graph
    const graph = grid
        .mapN((a) => (a === "S" ? "a" : (a === "E" ? "z" : a)))
        .mapN((a) => (a.codePointAt(0) - "a".codePointAt(0)))
        .toGraph((n1, n2) => (n1+1 >= n2));

    return { start, end, graph };
}
