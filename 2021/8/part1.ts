import {readFileSync} from "fs";
import {resolve} from "path";


const str = readFileSync(resolve(__dirname, "./input.txt"), {encoding: "utf-8"});
const inputs  = str.split("\n").map(s => s.split("|")[0].trim().split(" "));
const outputs = str.split("\n").map(s => s.split("|")[1].trim().split(" "));

function is1478(str: string): boolean {
    const len = str.length;
    return (len === 7 || len === 4 || len === 2 || len === 3);
}

const counts = outputs.map(output => output.reduce((sum, cur) => sum + (is1478(cur) ? 1 : 0), 0))

console.log(counts.reduce((sum, cur) => sum + cur, 0));
