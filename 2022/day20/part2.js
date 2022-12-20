require("../utils");
const fs = require("fs");

const file = fs.readFileSync("./input.txt", { encoding: "utf8" });

const KEY = 811589153;

const values = file.split("\n").map(line => parseInt(line) * KEY);

// Create linked list
const nodes = values.map((val) => ({
    val, left: undefined, right: undefined
}));
nodes.forEach((node, i, arr) => {
    node.left  = arr.at(i-1);
    node.right = arr.at((i+1) % arr.length);
});

// Map of values to their associated node
const nodeMap = new Map();
nodes.forEach((node) => nodeMap.set(node.val, node));

function swapNodes(node1, node2) {
    const node1L = node1.left;
    const node1R = node1.right;

    const node2L = node2.left;
    const node2R = node2.right;

    node1L.right = node2;
    node1R.left = node2;

    node2L.right = node1;
    node2R.left = node1;

    node1.left = node2L;
    node1.right = node2R;

    node2.left = node1L;
    node2.right = node1R;
}
function swapRight(node) {
    const node2 = node.right;
    const nodeL = node.left;
    const nodeR = node2.right;

    nodeR.left = node;
    nodeL.right = node2;

    node2.left = nodeL;
    node2.right = node;

    node.left = node2;
    node.right = nodeR;
}
function swapLeft(node) {
    const node2 = node.left;
    const nodeL = node2.left;
    const nodeR = node.right;

    nodeR.left = node2;
    nodeL.right = node;

    node2.left = node;
    node2.right = nodeR;

    node.left = nodeL;
    node.right = node2;
}

function printList(node0) {
    let str = "";
    let node = node0;
    do {
        str += node.val + ", ";
        node = node.right;
    } while(node !== node0);
    console.log(str);
}

function mix(nodes) {
    for (let n = 0; n < nodes.length; n++) {
        const val = nodes[n].val;

        const node = nodes[n];
        for (let i = 0; i < Math.abs(val) % (nodes.length-1); i++) {
            if (val > 0)
                swapRight(node);
            else
                swapLeft(node);
        }
    }
}

for (let i = 0; i < 10; i++)
    mix(nodes);

let i0 = nodes.findIndex((val) => (val.val === 0));

let node0 = nodes[i0];
function getVal(node, dist) {
    for (let i = 0; i < dist % values.length; i++)
        node = node.right;
    return node.val;
}

const vals = [getVal(node0, 1000), getVal(node0, 2000), getVal(node0, 3000)];
console.log(vals.sum());

// Answer is 2159638736133
