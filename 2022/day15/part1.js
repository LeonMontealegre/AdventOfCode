require("../utils");
const fs = require("fs");

const file = fs.readFileSync("./input.txt", { encoding: "utf8" });

const readings = file.split("\n")
    .map((line) => line.parseNumbers());

const targetY = 2000000;

const no = new Set();

const max = 20;

for (let i = 0; i < readings.length; i++) {
    const [x0, y0, x1, y1] = readings[i];

    const dist = Math.abs(x1 - x0) + Math.abs(y1 - y0);

    console.log(i, x0, y0, x1, y1, dist);

    const dy = Math.abs(targetY - y0);
    const dx = Math.abs(dist - dy);

    const xx0 = x0 - (dx*2);
    const xx1 = x0 + (dx*2);

    for (let x = xx0; x <= xx1; x++) {
        if (Math.abs(x - x0) + dy <= dist)
            no.add(x);
    }
}

console.log(no.size - 1);
