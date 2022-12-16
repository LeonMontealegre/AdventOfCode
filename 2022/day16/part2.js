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


const caches = new Map();//[new Map(), new Map()];
function runSim(cur, opened, minsLeft, numPlayers) {
    if (minsLeft <= 0) {
        if (numPlayers === 1)
            return 0;
        return runSim("AA", opened, 26, numPlayers - 1);
    }
    const key = opened.sort().join(",");
    if (!caches.has(minsLeft))
        caches.set(minsLeft, [new Map(), new Map()]);
    const c1 = caches.get(minsLeft);
    if (!c1[numPlayers-1].has(cur))
        c1[numPlayers-1].set(cur, new Map());
    const c2 = c1[numPlayers-1].get(cur);
    if (c2.has(key))
        return c2.get(key);

    let best = 0;
    { // Option 1, open this valve
        const curVal = graph.get(cur);
        if (curVal > 0 && !opened.includes(cur))
            best = Math.max(best, ((minsLeft - 1) * curVal + runSim(cur, [...opened, cur], minsLeft - 1, numPlayers)));
    }
    { // Option 2, move to another valve
        for (const next of graph.getConnections(cur))
            best = Math.max(best, runSim(next, [...opened], minsLeft - 1, numPlayers));
    }
    c2.set(key, best);

    return best;
}

const result = runSim("AA", [], 26, 2);

console.log(result);

// const cache = new Map();
// function runSim(cur, elCur, opened, minsLeft) {
//     if (minsLeft <= 0)
//         return 0;
//     const key = `${cur}|${elCur}|${opened.join(",")}|${minsLeft}`;
//     if (cache.has(key))
//         return cache.get(key);

//     let best = 0;
//     { // Option 1, we both open a valve
//         // (Only if not on the same valve and they're both not-opened)
//         if (cur !== elCur && !opened.includes(cur) && !opened.includes(elCur)) {
//             const curVal = graph.get(cur), elVal = graph.get(elCur);
//             best = Math.max(best, ((minsLeft - 1) * (curVal + elVal) + runSim(cur, elCur, [...opened, cur, elCur], minsLeft - 1)));
//         }
//     }
//     { // Option 2, we open our valve, elephant moves
//         const curVal = graph.get(cur);
//         if (curVal > 0 && !opened.includes(cur)) {
//             for (const elNext of graph.getConnections(elCur))
//                 best = Math.max(best, ((minsLeft - 1) * curVal + runSim(cur, elNext, [...opened, cur], minsLeft - 1)));
//         }
//     }
//     { // Option 3, elephant opens their valve, we move
//         const elVal = graph.get(elCur);
//         if (elVal > 0 && !opened.includes(elCur)) {
//             for (const next of graph.getConnections(cur))
//                 best = Math.max(best, ((minsLeft - 1) * elVal + runSim(next, elCur, [...opened, elCur], minsLeft - 1)));
//         }
//     }
//     { // Option 4, we both move
//         for (const next of graph.getConnections(cur)) {
//             for (const elNext of graph.getConnections(elCur))
//                 best = Math.max(best, runSim(next, elNext, [...opened], minsLeft - 1));
//         }
//     }
//     cache.set(key, best);

//     return best;
// }


