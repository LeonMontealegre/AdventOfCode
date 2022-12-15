import {readFileSync} from "fs";
import {resolve} from "path";


const DAYS = 256;

const str = readFileSync(resolve(__dirname, "./input.txt"), {encoding: "utf-8"});
const initialFish = str.split(",").map(v => parseInt(v));


// Store fish quantized by number of remaining days
//  the index of the array represents the number of remaining days
//  the value at that index is the # of fish that have that many days left
let fish = Array(9).fill(0);

// Setup initial fish counts
initialFish.forEach(f => fish[f]++);

for (let d = 0; d < DAYS; d++) {
    // Move each fish to the left
    const newFish = fish[0];
    fish = [...fish.slice(1), newFish];
    fish[6] += newFish;
}

const totalCount = Array.from(fish.values()).reduce((sum, cur) => sum + cur, 0);

console.log(totalCount);
