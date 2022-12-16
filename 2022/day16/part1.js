require("../utils");
const fs = require("fs");

const file = fs.readFileSync("./test.txt", { encoding: "utf8" });

const lines = file.split("\n")
    .map((line) => [
        line.slice("Valve ".length, "Valve ".length + 2),
        line.parseNumbers()[0],
        line.slice(line.indexOf("valves") + "valves".length).split(",").map(v => v.trim())
    ]);

let connections = new Map();

const conversion = new Map();
const conversionI = new Map();

const graph = new Array.Graph();

for (let i = 0; i < lines.length; i++) {
    const [cur, rate, others] = lines[i];

    conversion.set(cur, i);
    conversionI.set(i, cur);

    graph.add(i, rate);

}
for (let i = 0; i < lines.length; i++) {
    const [cur, rate, others] = lines[i];


    others.forEach((o) => {
        graph.addConnection(i, conversion.get(o));
    })
}


const aa = Array.from(graph.vertices).filter(([key, val]) => val > 0);

aa.sort(([a,b], [c,d]) => (d - b));

// console.log(aa);

const onlyTargets = aa.map(([key, val]) => key);

// cosno

// console.log(onlyTargets);

// const permutations = arr => {
//     if (arr.length <= 2) return arr.length === 2 ? [arr, [arr[1], arr[0]]] : arr;
//     return arr.reduce(
//       (acc, item, i) =>
//         acc.concat(
//           permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(val => [
//             item,
//             ...val,
//           ])
//         ),
//       []
//     );
//   };

const AA = conversion.get("AA");

const distsOfDists = [];
for (const target of [AA, ...onlyTargets]) {
    const dists = graph.bfsDists(target);
    distsOfDists[target] = [];
    for (const [other, dist] of dists)
        distsOfDists[target][other] = dist;
        // distsOfDists.set(`${target}:${other}`, dist);
}
// console.log(distsOfDists);

function sim(list) {
    let min = 0;
    let cur = AA;
    let totalPressure = 0;
    let curTarg = 0;
    let runningPressure = 0;

    while (min < 30) {
        totalPressure += runningPressure;

        if (curTarg < list.length) {
            const target = list[curTarg];
            const dist = distsOfDists[cur][target];

            // go to target
            totalPressure += runningPressure * (dist);
            min += dist;

            // at target
            runningPressure += graph.get(target);

            // get next target
            cur = list[curTarg];
            curTarg++;
        }

        min++;
    }

    return totalPressure;
}

// for ()

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }


//   let best = 0;
//   for (let it = 0; it < 1e9; it++) {
//     const path = shuffle(onlyTargets);

//     const val = sim(path);

//     if (val > best)
//         best = val;
//   }

//   console.log(best);


{
    const ITS = 1e8;

    let targets = [...onlyTargets];

    let best = 0;

    let curPath = [];

    for (let i = 0; i < 3; i++) {
        const hist0 = [];
        targets.forEach((targ) => hist0[targ] = 0);

        for (let it = 0; it < ITS; it++) {
            const path = shuffle(targets);
            const val = sim([...curPath, ...path]);
            if (val > best)
                best = val;
            hist0[path[0]] += val;
        }

        let max = -1;
        let curMax = -1;
        hist0.forEach((val, i) => {
            if (val > curMax) {
                max = i;
                curMax = val;
            }
        })

        curPath.push(max);

        targets = targets.filter((target) => (target !== max));
        // console.log(conversionI.get(max), curMax);
    }

    console.log(curPath.map((i) => conversionI.get(i)));
}






//   console.log(sim(["DD", "BB", "JJ", "HH", "EE", "CC"]));

// const TOP = 5;

// console.log("EHEREer");
// function buildPath(cur, visited) {
//     const dists = Array.from(graph.bfsDists(cur)).filter(([key, val]) => onlyTargets.includes(key) && !visited.has(key));
//     if (dists.length === 0)
//         return [];

//     const best = dists.map(([key, dist]) => [key, graph.get(key) - dist])
//         .sort(([a,d0], [b,d1]) => (d1 - d0))
//         .slice(0, TOP);

//     const nextPaths = [];
//     best.forEach((best) => {
//         const result = buildPath(best, new Set([...visited, best]));
//     });
//     const [theBest] = best[0];
//     visited.add(theBest);

//     return [theBest, ...buildPath(theBest, visited)];
// }
// let path = buildPath("AA", new Set());

// console.log(path);

// TEST: BEST: ["DD", "BB", "JJ", "HH", "EE", "CC"]


// console.log(Array.from(graph.bfsDists("AA")).filter(([key, val]) => onlyTargets.includes(key)));

// const paths = permutations(onlyTargets);

// const sims = paths.map((perm) => sim(perm));

// console.log(sims);

// console.log(sims.max())
