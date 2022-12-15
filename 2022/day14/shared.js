const fs = require("fs");

module.exports = function setup(file) {
    // Load paths input
    const paths = fs
        .readFileSync(file, { encoding: "utf8" })
        .split("\n")
        .map((line) => line.parseNumbers().groupBy(2));

    // Create grid
    const grid = new Map.TupleMap();

    // Map each path to a tuple of the two points to line-between
    paths.flatMap((path) => path.withPrev())
        // Map each point to the list of points in the line
        .flatMap(([p0, p1]) => p0.pathTo(p1))
        // Set each point in the grid
        .forEach((pt) => grid.set(pt, "#"));

    // Utility functions
    function getBounds() {
        const bounds = { minX: 500, minY: 0, maxX: 500, maxY: 0 };
        for (const [[x,y]] of grid) {
            bounds.minX = Math.min(bounds.minX, x);
            bounds.maxX = Math.max(bounds.maxX, x);
            bounds.minY = Math.min(bounds.minY, y);
            bounds.maxY = Math.max(bounds.maxY, y);
        }
        return bounds;
    }
    function printGrid() {
        const bounds = getBounds(grid);
        const pGrid = new Array(bounds.maxY - bounds.minY + 1)
            .fill((y) => new Array(bounds.maxX - bounds.minX + 1)
                .fill((x) => (grid.get([x + bounds.minX,y + bounds.minY]) ?? ".")));
        console.log(pGrid.map((row) => row.join("")).join("\n"));
    }

    return { grid, getBounds, printGrid };
}
