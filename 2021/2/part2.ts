import {readFileSync} from "fs";
import {resolve} from "path";


type Command = {
    kind: "forward" | "up" | "down";
    amount: number;
}


const str = readFileSync(resolve(__dirname, "./input.txt"), {encoding: "utf-8"});
const commands = str.split("\n")
    .map(cmd => cmd.split(" ") as [Command["kind"], string])
    .map<Command>(([kind, amt]) => ({ kind, amount: parseInt(amt) }));


let aim = 0, depth = 0, xPos = 0;

for (const cmd of commands) {
    if (cmd.kind === "forward") {
        xPos += cmd.amount;
        depth += cmd.amount * aim;
    } else if (cmd.kind === "up" || cmd.kind === "down") {
        const mult = (cmd.kind === "up" ? -1 : +1);
        aim += mult * cmd.amount;
    }
}

console.log(xPos, depth, xPos * depth);