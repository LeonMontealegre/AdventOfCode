import {readFileSync} from "fs";
import {resolve} from "path";


const str = readFileSync(resolve(__dirname, "./input.txt"), {encoding: "utf-8"});
const depths = str.split("\n").map(v => parseInt(v));

const windowSums = depths.slice(0, -2).map((_, i) => (depths[i] + depths[i+1] + depths[i+2]));


let numIncreases = 0;
for (let d = 1; d < windowSums.length; d++) {
    if (windowSums[d] > windowSums[d-1])
        numIncreases++;
}

console.log(numIncreases);