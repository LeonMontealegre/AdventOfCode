require("../utils");
const fs = require("fs");

// Parse monkeys
const monkeys = fs
    .readFileSync("./input.txt", { encoding: "utf8" })
    .split("\n\n")
    .map((section) => section.split("\n"))
    .map(([_, itemsLine, opLine, testLine, trueLine, falseLine]) => ({
        items:       itemsLine.parseNumbers(),
        operation:   opLine.slice("  Operation: new = ".length),
        testVal:     testLine.parseNumbers()[0],
        trueMonkey:  trueLine.parseNumbers()[0],
        falseMonkey: falseLine.parseNumbers()[0],
        count:       0,
    }));

// Calculate least common multiplier
const testValGCD = monkeys.map((m) => (m.testVal)).product();

// Run the monkey simulation 10,000 times
Array(10000).fill(0)
    .forEach(() => {
        // Do round
        monkeys.forEach((monkey) => {
            // Loop through each item, inspect, and throw
            monkey.items
                // Calculate new item value
                .map((item) => (eval(monkey.operation.replaceAll("old", item)) % testValGCD))
                // Figure out monkey to throw to
                .map((newItem) => [
                    newItem,
                    (newItem % monkey.testVal === 0) ? monkey.trueMonkey : monkey.falseMonkey
                ])
                // Throw to next monkey
                .forEach(([newItem, nextMonkey]) => (monkeys[nextMonkey].items.push(newItem)));

            // Increment count for the monkey
            monkey.count += monkey.items.length;

            // Clear this monkey's items
            monkey.items = [];
        });
    })

console.log(monkeys.map((m) => m.count).maxN(2).product());

// Answer is 14636993466
