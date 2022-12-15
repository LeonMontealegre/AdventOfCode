import {readFileSync} from "fs";
import {resolve} from "path";


type Line = {
    x1: number, x2: number;
    y1: number, y2: number;
}

function getPoints({x1,y1, x2,y2}: Line): [number, number][] {
    const len = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
    const dirX = (x2 - x1)/len, dirY = (y2 - y1)/len;

    let curPoint = [x1, y1] as [number, number];
    let points = [curPoint];
    while (curPoint[0] !== x2 || curPoint[1] !== y2) {
        const nextPoint = [Math.round(curPoint[0] + dirX), Math.round(curPoint[1] + dirY)] as [number, number];
        if (nextPoint[0] === curPoint[0] && nextPoint[1] === curPoint[1])
            nextPoint[0]++; // Arbitrarily increase x if it rounds wrong
        curPoint = nextPoint;
        points.push(curPoint);
    }
    return points;
}

const str = readFileSync(resolve(__dirname, "./input.txt"), {encoding: "utf-8"});
const lines = str.split("\n")
    .map(line => line.split("->").flatMap(s => s.split(",")))
    .map(nums => nums.map(s => parseInt(s)))
    .map<Line>(([x1,y1, x2,y2]) => ({ x1,y1,x2,y2 }));

// Counts for each point with key "x,y"
const counts = new Map<string, number>();

lines
    .filter(({x1,y1, x2,y2}) => (x1 === x2 || y1 === y2))
    .forEach(line => {
        // Get the points each line describes and increase counts
        getPoints(line).forEach(([x, y]) => {
            const key = `${x},${y}`;
            counts.set(key, (counts.get(key) ?? 0) + 1);
        })
    });

// Find counts > 1
let totalPoints = 0;
counts.forEach((count, pos) => {
    totalPoints += (count > 1 ? 1 : 0);
});

console.log(totalPoints);
