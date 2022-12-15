const fs = require("fs");

const file = fs.readFileSync("./input.txt", { encoding: "utf8" });

const WIN_PTS = 6;
const DRAW_PTS = 3;
const LOSE_PTS = 0;

const ENEMY_ROCK = "A";
const ENEMY_PAPER = "B";
const ENEMY_SCISSORS = "C";

const MY_ROCK = "X";
const MY_PAPER = "Y";
const MY_SCISSORS = "Z";

const MyMovePoints = {
    [MY_ROCK]: 1,
    [MY_PAPER]: 2,
    [MY_SCISSORS]: 3,
}

const Matchups = {
    [ENEMY_ROCK]: {
        [MY_ROCK]: DRAW_PTS,
        [MY_PAPER]: WIN_PTS,
        [MY_SCISSORS]: LOSE_PTS,
    },
    [ENEMY_PAPER]: {
        [MY_ROCK]: LOSE_PTS,
        [MY_PAPER]: DRAW_PTS,
        [MY_SCISSORS]: WIN_PTS,
    },
    [ENEMY_SCISSORS]: {
        [MY_ROCK]: WIN_PTS,
        [MY_PAPER]: LOSE_PTS,
        [MY_SCISSORS]: DRAW_PTS,
    },
};

// Part 1

{
    const points = file.split("\n")
        .map((line) => (line.split(" ")))
        .map(([enemyMove, myMove]) => (Matchups[enemyMove][myMove] + MyMovePoints[myMove]))
        .reduce((a, b) => (a + b));

    console.log(points);

    // Answer is 13446
}


// Part 2

{
    // X lose
    // Y draw
    // Z win
    const LOSE = "X";
    const DRAW = "Y";
    const WIN  = "Z";

    const MyMovePts = {
        "X": LOSE_PTS,
        "Y": DRAW_PTS,
        "Z": WIN_PTS,
    }

    const InvMatchups = {
        [ENEMY_ROCK]: {
            [DRAW_PTS]: MY_ROCK,
            [WIN_PTS]: MY_PAPER,
            [LOSE_PTS]: MY_SCISSORS,
        },
        [ENEMY_PAPER]: {
            [LOSE_PTS]: MY_ROCK,
            [DRAW_PTS]: MY_PAPER,
            [WIN_PTS]: MY_SCISSORS,
        },
        [ENEMY_SCISSORS]: {
            [WIN_PTS]: MY_ROCK,
            [LOSE_PTS]: MY_PAPER,
            [DRAW_PTS]: MY_SCISSORS,
        },
    };

    const points = file.split("\n")
        .map((line) => (line.split(" ")))
        .map(([enemyMove, myEnd]) => {
            const move = InvMatchups[enemyMove][MyMovePts[myEnd]];
            return (MyMovePoints[move] + Matchups[enemyMove][move]);
        })
        .reduce((a, b) => (a + b));

    console.log(points);

    // Answer is 13509
}