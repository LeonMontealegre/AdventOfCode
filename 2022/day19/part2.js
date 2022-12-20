require("../utils");
const fs = require("fs");

const file = fs.readFileSync("./input.txt", { encoding: "utf8" });

const blueprints = file.split("\n")
    .map((line) => {
        const stuff = line.split(".");
        const [a,b,[c0,c1],[d0,d1]] = stuff.map((s) => s.parseNumbers());

        return [
            [a[1], 0, 0, 0],
            [b[0], 0, 0, 0],
            [c0,c1,0,0],
            [d0,0,d1,0]
        ];
    });

const ORE = 0, CLAY = 1, OBSIDIAN = 2, GEODE = 3;

const TIME = 24;

function canAfford(cost, counts) {
    for (let i = 0; i < cost.length; i++) {
        const amt = cost[i];
        if (counts[i] < amt)
            return false;
    }
    return true;
}

function getBuyOptions(costs, counts) {
    let options = [];
    for (let i = 0; i < costs.length; i++) {
        const cost = costs[i];
        if (canAfford(cost, counts))
            options.push(i);
    }
    return options;
}

function sim0(costs) {
    const map = new Map();

    function sim(t, curRobots, counts) {
        const key = `${t}|${curRobots.join(",")}|${counts.join(",")}`;
        if (map.has(key))
            return map.get(key);

        if (t === 0) {
            // console.log(counts, curRobots);
            return [counts, curRobots];
        }

        // decide which robot to buy
        const options = getBuyOptions(costs, counts);
        let bestCounts = counts;
        let bestBots = curRobots;

        // console.log(t, curRobots, counts);

        // collect resources
        let counts2 = [...counts];
        for (let i = 0; i < curRobots.length; i++)
            counts2[i] += curRobots[i];


        // if we can buy GEODE robot, always do it
        if (options.includes(GEODE)) {
            let nextRobots = [...curRobots];
            nextRobots[GEODE]++;

            let counts3 = [...counts2];

            const cost = costs[GEODE];
            for (let i = 0; i < cost.length; i++) {
                const amt = cost[i];
                counts3[i] -= amt;
            }

            let result = sim(t-1, nextRobots, counts3);
            map.set(key, result);
            return result;
        }

        // if we can buy OBSIDIAN robot, always do it
        if (options.includes(OBSIDIAN)) {
            let nextRobots = [...curRobots];
            nextRobots[OBSIDIAN]++;

            let counts3 = [...counts2];

            const cost = costs[OBSIDIAN];
            for (let i = 0; i < cost.length; i++) {
                const amt = cost[i];
                counts3[i] -= amt;
            }

            let result = sim(t-1, nextRobots, counts3);
            map.set(key, result);
            return result;
        }


        // buy robot
        for (const option of options) {
            let nextRobots = [...curRobots];
            nextRobots[option]++;

            let counts3 = [...counts2];

            const cost = costs[option];
            for (let i = 0; i < cost.length; i++) {
                const amt = cost[i];
                counts3[i] -= amt;
            }

            let [result, bots] = sim(t-1, nextRobots, counts3);
            // console.log(result);
            if (result[GEODE] >= bestCounts[GEODE]) {
                bestCounts = result;
                bestBots = bots;
            }
        }

        // don't buy robot option (only do when we have less than 4 ores, otherwise it's pointless and we should
        //  always buy when we have more then that)
        if (counts[ORE] < 4) {
            let [result, bots] = sim(t-1, [...curRobots], counts2);
            if (result[GEODE] >= bestCounts[GEODE]) {
                bestCounts = result;
                bestBots = bots;
            }
        }

        map.set(key, [bestCounts, bestBots]);
        return [bestCounts, bestBots];
    }

    return sim(32, [1,0,0,0], [0,0,0,0]);
}

// console.log(sim(24, blueprints[1], [1,0,0,0], [0,0,0,0]));

let geodeQualityTotal = 1;


for (let i = 0; i < 3; i++) {
    const [result, bots] = sim0(blueprints[i]);
    const amt = result[GEODE];
    const level = amt;
    geodeQualityTotal *= level;
    console.log("blueprint",i,"quality",level,"|",result,"|",bots);
}

console.log(geodeQualityTotal);
