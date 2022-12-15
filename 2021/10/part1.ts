import {readFileSync} from "fs";
import {resolve} from "path";


const str = readFileSync(resolve(__dirname, "./test.txt"), {encoding: "utf-8"});
const lines = str.split("\n");


const SCORES = new Map<string, number>([
    [")", 3],
    ["]", 57],
    ["}", 1197],
    [">", 25137],
]);



