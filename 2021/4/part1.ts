import {readFileSync} from "fs";
import {resolve} from "path";


class Board {
    H: number;
    W: number;
    nums: number[][];

    constructor(nums: number[][]) {
        this.H = nums.length;
        this.W = nums[0].length;
        this.nums = nums;
    }

    private isRowComplete(completed: Set<number>, row: number): boolean {
        for (let col = 0; col < this.W; col++) {
            if (!completed.has(this.nums[row][col]))
                return false;
        }
        return true;
    }
    private isColComplete(completed: Set<number>, col: number): boolean {
        for (let row = 0; row < this.H; row++) {
            if (!completed.has(this.nums[row][col]))
                return false;
        }
        return true;
    }

    isComplete(completed: Set<number>): boolean {
        { // check rows
            for (let row = 0; row < this.H; row++) {
                if (this.isRowComplete(completed, row))
                    return true;
            }
        }
        { // check cols
            for (let col = 0; col < this.W; col++) {
                if (this.isColComplete(completed, col))
                    return true;
            }
        }
    }

    calcScore(completed: Set<number>): number {
        let sum = 0;
        for (let row = 0; row < this.H; row++) {
            for (let col = 0; col < this.W; col++)
                sum += (completed.has(this.nums[row][col]) ? 0 : this.nums[row][col]);
        }
        return sum;
    }
}

function runSim(nums: number[], boards: Board[]) {
    const calledNums = new Set<number>();

    for (const num of nums) {
        calledNums.add(num);
        for (let b = 0; b < boards.length; b++) {
            if (boards[b].isComplete(calledNums)) {
                console.log("Completed! Score:", num*boards[b].calcScore(calledNums), b);
                return;
            }
        }
    }
}

const str = readFileSync(resolve(__dirname, "./test.txt"), {encoding: "utf-8"});
const splits = str.split("\n\n");

const nums = splits[0].split(",").map(v => parseInt(v));

const boards = splits.slice(1).map(b => new Board(
    b.split("\n")
     .map(l => l.trim().split(/\s+/).map(v => parseInt(v)))
));

runSim(nums, boards);


