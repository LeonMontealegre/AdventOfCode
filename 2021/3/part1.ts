import {readFileSync} from "fs";
import {resolve} from "path";


function binToDec(num: number[]): number {
    return num.reverse().reduce((sum, cur, i) => sum + (cur << i), 0);
}


const str = readFileSync(resolve(__dirname, "./input.txt"), {encoding: "utf-8"});
const numbers = str.split("\n");


const digitSums = numbers
    .slice(1)
    .reduce((sum, cur) =>
        cur.split("").map((v, i) => parseInt(v) + sum[i]),
        numbers[0].split("").map(v => parseInt(v))
    );

const gammaNum   = digitSums.map(sum => (sum > numbers.length/2 ? 1 : 0));
const epislonNum = digitSums.map(sum => (sum < numbers.length/2 ? 1 : 0));


const gammaRate   = binToDec(gammaNum);
const epsilonRate = binToDec(epislonNum);


console.log(gammaRate, epsilonRate, gammaRate*epsilonRate);
