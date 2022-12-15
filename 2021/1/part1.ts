import {readFileSync} from "fs";
import {resolve} from "path";


const str = readFileSync(resolve(__dirname, "./input.txt"), {encoding: "utf-8"});
const depths = str.split("\n").map(v => parseInt(v));


let numIncreases = 0;
for (let d = 1; d < depths.length; d++) {
    if (depths[d] > depths[d-1])
        numIncreases++;
}

console.log(numIncreases);