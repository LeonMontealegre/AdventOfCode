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

const TIME = 32;

function sim0(costs) {
    const map = new Map();

    function canAfford(cost, curCounts) {
        for (let i = 0; i < cost.length; i++) {
            const amt = cost[i];
            if (curCounts[i] < amt)
                return false;
        }
        return true;
    }

    function getBuyOptions(curCounts) {
        let options = [];
        for (let i = 0; i < costs.length; i++) {
            const cost = costs[i];
            if (canAfford(cost, curCounts))
                options.push(i);
        }
        return options;
    }

    function buy(curRobots, curCounts, toBuy) {
        // Don't buy anything
        if (toBuy === undefined)
            return [curRobots, curCounts];

        let nextRobots = [...curRobots];
        nextRobots[toBuy]++;

        let nextCounts = [...curCounts];

        const cost = costs[toBuy];
        for (let i = 0; i < cost.length; i++) {
            const amt = cost[i];
            nextCounts[i] -= amt;
        }

        return [nextRobots, nextCounts];
    }

    function sim(t, curRobots, curCounts) {
        // Return current counts
        if (t === 0)
            return curCounts;

        const key = `${t}|${curRobots.join(",")}|${curCounts.join(",")}`;
        if (map.has(key))
            return map.get(key);

        // Collect resources
        const nextCounts = curCounts.map((count, i) => (count + curRobots[i]));

        // Calculate best result
        const result = (() => {
            //  Buyable options and option for not buying anything (only do if we have < 4 ore)
            const options = [...getBuyOptions(curCounts), ...(curCounts[ORE] < 4 ? [undefined] : [])];

            // If we can buy GEODE robot, always do it
            if (options.includes(GEODE))
                return sim(t-1, ...buy(curRobots, nextCounts, GEODE));

            // If we can buy OBSIDIAN robot, always do it
            if (options.includes(OBSIDIAN))
                return sim(t-1, ...buy(curRobots, nextCounts, OBSIDIAN));

            // Otherwise return best results
            return options
                .map((option) => sim(t-1, ...buy(curRobots, nextCounts, option)))
                .reduce((max, next) => (next[GEODE] >= max[GEODE] ? next : max));
        })();

        map.set(key, result);
        return result;
    }

    return sim(TIME, [1,0,0,0], [0,0,0,0]);
}

let total = 1;
for (let i = 0; i < 3; i++) {
    const result = sim0(blueprints[i]);
    total *= result[GEODE];
    console.log("blueprint",i,"quality",result[GEODE],"|",result);
}

console.log(total);

// Answer is 15510
