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

const hCommands = commands.filter(cmd => cmd.kind === "forward");
const dCommands = commands.filter(cmd => cmd.kind === "up" || cmd.kind === "down");

const depth = dCommands.reduce((sum, cur) => sum + (cur.kind === "up" ? -1 : +1) * cur.amount, 0);
const xPos = hCommands.reduce((sum, cur) => sum + cur.amount, 0);

console.log(xPos, depth, xPos * depth);