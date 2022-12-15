const util = require('util')

require("../utils");
const fs = require("fs");

const file = fs.readFileSync("./input.txt", { encoding: "utf8" });

const lines = file.split("\n");


let disk = {
    path: "",
    name: "/",
    type: "dir",
    children: [],
    parent: undefined,
}

let cur = disk;

for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    const [_, cmd, args] = line.split(" ");

    if (cmd === "ls") {
        // ls
        let files = [];
        while (lines[i+1] && !lines[i+1].startsWith("$"))
            files.push(lines[++i]);

        files.forEach((file) => {
            const [a, name] = file.split(" ");
            if (a === "dir") {
                cur.children.push({
                    path: cur.path + "/" + name,
                    name,
                    type: "dir",
                    children: [],
                    parent: cur,
                });
            } else {
                cur.children.push({
                    path: cur.path + "/" + name,
                    name,
                    type: "file",
                    children: [],
                    parent: cur,
                    size: parseInt(a),
                });
            }
        })
    } else {
        // cd
        if (args === "..") {
            cur = cur.parent;
        } else {
            cur = cur.children.find(({ name }) => (name === args));
        }
    }
}


function calcSize(cur) {
    if (cur.type === "file")
        return cur.size;
    else {
        if (cur.size)
            return cur.size;
        cur.size = cur.children.map((child) => calcSize(child)).reduce((a,b) => (a+b), 0);
        return cur.size;
    }
}
calcSize(disk);

// yield* !!!!


{ // Part 1
    let total = 0;
    function calcSizes(cur) {
        if (cur.type === "dir" && cur.size <= 100000) {
            total += cur.size;
        }
        for (const child of cur.children)
            calcSizes(child);
    }
    calcSizes(disk);

    console.log(total);

    // Answer is 1432936
}

{ // Part 2
    const availableSpace = 70000000 - disk.size;

    const targetSpace = 30000000;

    let smallest = disk.size;
    function findSmallest(cur) {
        if (cur.type === "dir" && availableSpace + cur.size >= targetSpace) {
            if (cur.size < smallest)
                smallest = cur.size;
        }

        for (const child of cur.children)
            findSmallest(child);

    }
    findSmallest(disk);

    console.log(smallest);

    // Answer is 272298
}
