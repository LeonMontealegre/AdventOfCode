require("../utils");
const fs = require("fs");

const readings = fs
    .readFileSync("./input.txt", { encoding: "utf8" })
    .split("\n")
    .map((line) => line.parseNumbers());

const targetY = 2000000;

const result = readings
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
    // Calculate interval of points
    .map(([x0, dx]) => [x0 - dx, x0 + dx])
    // Sort each interval by their starting point
    .sort(([a0, _], [b0, __]) => (a0 - b0))
    // Union all intervals that overlap
    .reduceInArray((total, [x0, x1]) => ([
        ...total.slice(0, -1), // Keep previous intervals and edit last one
        ...((([p0, p1]) => (
            (x0 <= p1)
            ? ([[p0, Math.max(p1, x1)]]) // Combine into single interval
            : ([[p0, p1], [x0, x1]])     // Add as separate interval
        ))(total.last())),
    ]))
    // Map each interval to the length of the interval
    .map(([x0, x1]) => (x1 - x0))
    // Sum each interval
    .sum();

console.log(result);

// Answer is 5838453
