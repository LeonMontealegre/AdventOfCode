import {readFileSync} from "fs";
import {resolve} from "path";


function strRemove(str1: string, remove: string): string {
    return str1.split("").filter(c => !remove.includes(c)).join("");
}

function strPermuteEqual(str1: string, str2: string) {
    return str1.length === str2.length && (strRemove(str1, str2).length === 0);
}

function calcDigits(inputs: string[]): number[] {
    // Start with 1,4,7,8
    const digits = Array(10).fill(0);

    digits[1] = inputs.findIndex(s => s.length === 2);
    digits[4] = inputs.findIndex(s => s.length === 4);
    digits[7] = inputs.findIndex(s => s.length === 3);
    digits[8] = inputs.findIndex(s => s.length === 7);


    // There are 3 digits with 5-connections (2, 3, 5)

    //  2 is the one that shares only 2 connections with 4
    const d4 = inputs[digits[4]];
    digits[2] = inputs.findIndex(d => d.length === 5 && strRemove(d4, d).length === 2);

    // 3 is the only 5-connection one with the right-2 connections
    const d1 = inputs[digits[1]];
    digits[3] = inputs.findIndex(d => d.length === 5 && strRemove(d1, d).length === 0);

    // 5 must be the last one
    digits[5] = inputs.findIndex((d, i) => d.length === 5 && i !== digits[2] && i !== digits[3]);


    // Now we just have the 3, 6-connection digits (0, 6, 9)

    // 6 is the one that doesn't share the right-2 connections
    digits[6] = inputs.findIndex(d => d.length === 6 && strRemove(d1, d).length === 1);

    // 9 shares all connections with 4
    digits[9] = inputs.findIndex(d => d.length === 6 && strRemove(d4, d).length === 0);

    // 0 is the last one
    digits[0] = inputs.findIndex((d, i) => d.length === 6 && i !== digits[6] && i !== digits[9]);

    return digits;
}


const str = readFileSync(resolve(__dirname, "./input.txt"), {encoding: "utf-8"});

const inputs  = str.split("\n").map(s => s.split("|")[0].trim().split(" "));
const outputs = str.split("\n").map(s => s.split("|")[1].trim().split(" "));

const nums = inputs.map((input, i) => {
    const output = outputs[i];

    const digits = calcDigits(input);
    return output.map(d => digits.findIndex(i => strPermuteEqual(d, input[i])));
});

const counts = nums.map(num => num.reduce((sum, cur) => 10*sum + cur, 0));

console.log(counts.reduce((sum, cur) => sum + cur, 0));
