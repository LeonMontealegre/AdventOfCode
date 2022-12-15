import {readFileSync} from "fs";
import {resolve} from "path";


function binToDec(num: number[]): number {
    return num.reverse().reduce((sum, cur, i) => sum + (cur << i), 0);
}

function calcGammaNum(nums: number[][]) {
    return nums
        .slice(1)
        .reduce((sum, cur) => cur.map((v, i) => v + sum[i]), nums[0])
        .map(sum => (sum >= nums.length/2 ? 1 : 0));
}
function calcEpsilonNum(nums: number[][]) {
    return nums
        .slice(1)
        .reduce((sum, cur) => cur.map((v, i) => v + sum[i]), nums[0])
        .map(sum => (sum >= nums.length/2 ? 0 : 1));
}


const str = readFileSync(resolve(__dirname, "./input.txt"), {encoding: "utf-8"});
const numbers = str.split("\n").map(num => num.split("").map(d => parseInt(d)));


let oxygenNums = numbers, co2Nums = numbers;
for (let curDigit = 0; curDigit < numbers[0].length; curDigit++) {
    if (oxygenNums.length > 1) {
        const gammaNum = calcGammaNum(oxygenNums);
        oxygenNums = oxygenNums.filter(num => (num[curDigit] === gammaNum[curDigit]));
    }
    if (co2Nums.length > 1) {
        const epsilonNum = calcEpsilonNum(co2Nums);
        co2Nums = co2Nums.filter(num => (num[curDigit] === epsilonNum[curDigit]));
    }
}

const oxygenNum = binToDec(oxygenNums[0]);
const co2Num    = binToDec(co2Nums[0]);

console.log(oxygenNum, co2Num, oxygenNum*co2Num);
