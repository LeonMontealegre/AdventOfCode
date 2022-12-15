require("../utils");
const fs = require("fs");

const readings = fs
    .readFileSync("./input.txt", { encoding: "utf8" })
    .split("\n")
    .map((line) => line.parseNumbers());

const targetY = 2000000;

const searchedPositions = readings
    // Map raw readings to calculate values
    .map(([x0, y0, x1, y1]) => [
        x0,
        // Calculate distance ("radius") of the sensor area
        // and then subtract the vertical distance from the targetY to the sensor
        // which results in the horizontal distance of the sensor at y = targetY
        (Math.abs(x1 - x0) + Math.abs(y1 - y0)) - Math.abs(targetY - y0)
    ])
    // If horizontal distance < 0, then the sensor area doesn't include targetY, so skip
    .filter(([_, dx]) => (dx >= 0))
    // Return each point between the horizontal boundaries
    //  of the sensor area at y = targetY
    .flatMap(([x0, dx]) => Math.linspace(x0 - dx, x0 + dx))
    // Just get unique points
    .unique();

console.log(searchedPositions.length - 1);

// Answer is 5838453
