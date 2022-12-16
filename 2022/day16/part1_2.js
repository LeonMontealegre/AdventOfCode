require("../utils");
const fs = require("fs");

const file = fs.readFileSync("./input.txt", { encoding: "utf8" });

const lines = file.split("\n")
    .map((line) => [
        line.slice("Valve ".length, "Valve ".length + 2),
        line.parseNumbers()[0],
        line.slice(line.indexOf("valves") + "valves".length).split(",").map(v => v.trim())
    ]);

const graph = new Array.Graph();
for (let i = 0; i < lines.length; i++) {
    const [cur, rate, _] = lines[i];
    graph.add(cur, rate);

}
for (let i = 0; i < lines.length; i++) {
    const [cur, _, others] = lines[i];
    others.forEach((o) => {
        graph.addConnection(cur, o);
    })
}


const cache = new Map();
function runSim(cur, opened, minsLeft) {
    if (minsLeft <= 0)
        return 0;
    const key = `${cur}|${opened.join(",")}|${minsLeft}`;
    if (cache.has(key))
        return cache.get(key);

    let best = 0;
    { // Option 1, open this valve
        const curVal = graph.get(cur);
        if (curVal > 0 && !opened.includes(cur))
            best = Math.max(best, ((minsLeft - 1) * curVal + runSim(cur, [...opened, cur], minsLeft - 1)));
    }
    { // Option 2, move to another valve
        for (const next of graph.getConnections(cur))
            best = Math.max(best, runSim(next, [...opened], minsLeft - 1));
    }
    cache.set(key, best);

    return best;
}

const result = runSim("AA", [], 30);

console.log(result);


