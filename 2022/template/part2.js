require("../utils");
const fs = require("fs");

const file = fs.readFileSync("./test.txt", { encoding: "utf8" });

const lines = file.split("\n");

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

}
