import {readFileSync} from "fs";
import {resolve} from "path";


const str = readFileSync(resolve(__dirname, "./input.txt"), {encoding: "utf-8"});
const lines = str.split("\n");

type Pos = `${number},${number}`;


const cucumbers = new Map<Pos, "E"|"S">();

const H = lines.length;
const W = lines[0].length;

lines.forEach((line, row) => {
    const c = line.split("");
    for (let col = 0; col < c.length; col++) {
        if (c[col] === "v")
            cucumbers.set(`${row},${col}`, "S");
        else if (c[col] === ">")
            cucumbers.set(`${row},${col}`, "E");
    }
});



function print(m: Map<Pos, "E"|"S">) {
    for (let r = 0; r < H; r++) {
        let s = "";
        for (let c = 0; c < W; c++) {
            const cuc = m.get(`${r},${c}`);
            if (cuc)
                s += (cuc === "E" ? ">" : "v");
            else
                s += ".";
        }
        console.log(s);
    }
}

function step(cucumbers: Map<Pos, "E"|"S">) {

    const nextCucumbers = new Map<Pos, "E"|"S">();

    cucumbers.forEach((val, pos) => {
        if (val !== "E")
            return;
        const [row, col] = pos.split(",").map(v => parseInt(v));
        const nextCol = (col + 1) % W;
        if (cucumbers.has(`${row},${nextCol}`)) {
            // don't move
            nextCucumbers.set(`${row},${col}`, "E");
            return;
        }
        nextCucumbers.set(`${row},${nextCol}`, "E");
    });

    cucumbers.forEach((val, pos) => {
        if (val !== "S")
            return;
        const [row, col] = pos.split(",").map(v => parseInt(v));
        const nextRow = (row + 1) % H;
        if (nextCucumbers.has(`${nextRow},${col}`) || cucumbers.get(`${nextRow},${col}`) === "S") {
            // don't move
            nextCucumbers.set(`${row},${col}`, "S");
            return;
        }
        nextCucumbers.set(`${nextRow},${col}`, "S");
    });

    return nextCucumbers;
}

function allSame(m1: Map<Pos, "E"|"S">, m2: Map<Pos, "E"|"S">) {
    if (!m1 || !m2)
        return false;

    const k1 = Array.from(m1.keys());
    const k2 = Array.from(m2.keys());
    k1.sort();
    k2.sort();
    return (k1.every((v, i) => v === k2[i]));
}

// print(cucumbers);
// console.log();
// print(step(cucumbers));
// console.log();
// print(step(step(cucumbers)));

let curCucumbers = cucumbers;
let prevCucumbers: Map<Pos, "E"|"S">;
let i = 0;
while(!allSame(curCucumbers, prevCucumbers)) {
    prevCucumbers = curCucumbers;
    curCucumbers = step(curCucumbers);
    console.log(i);
    i++;
}

console.log("Stopped on ", i);


