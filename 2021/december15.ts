import { readFileSync } from 'fs';

/**
 * https://adventofcode.com/2021/day/15
 */
const input = readFileSync('./december15.txt', 'utf-8');

console.log('star 1:');
console.log(star1());
console.log('star 2:');
console.log(star2());

///-------------------------------- broken recursive solution that exceeds the call stack ---------------------
function riskUntilEnd(area: number[][], riskLevel: number[][], row: number, col: number, risk: number): number {
    if (row < 0 || row > area.length - 1 || col < 0 || col > area[0].length - 1) {
        // out of bounds
        return Number.MAX_SAFE_INTEGER;
    } else if (row === area.length - 1 && col === area[0].length - 1) {
        // reached bottom right corner
        return risk + area[row][col];
    }
    const currentRisk = risk + area[row][col];
    if (currentRisk >= riskLevel[row][col]) {
        // path is already covered by another quicker
        return Number.MAX_SAFE_INTEGER;
    } else {
        // mark the current risk level of reaching this step
        riskLevel[row][col] = currentRisk;
        // naive depth first search, not optimal :(
        return Math.min(
            riskUntilEnd(area, riskLevel, row + 1, col, currentRisk), // down
            riskUntilEnd(area, riskLevel, row, col + 1, currentRisk), // right
            riskUntilEnd(area, riskLevel, row - 1, col, currentRisk), // up
            // riskUntilEnd(area, riskLevel, row, col - 1, currentRisk), // got lucky that the answer route does not go left
        );
    }
}

function star1() {
    const area: number[][] = input
        .split(/\r?\n\r?\n?/)
        .filter(Boolean)
        .map(row => row.split('').map(Number));
    const riskLevel: number[][] = area
        .map(row => row.map(() => Number.MAX_SAFE_INTEGER));

    // starting risk is negative top left corner, because it is not supposed to be counted
    return riskUntilEnd(area, riskLevel, 0, 0, -area[0][0]);
}

///------------------------------------------- Proper iterative solution

type Point = { row: number, col: number }

function isInBounds(area: number[][], point: Point) {
    return point.row >= 0 && point.row < area.length && point.col >= 0 && point.col < area[0].length;
}

function star2() {

    function getRiskLevel(point: Point) {
        return riskLevel[point.row][point.col];
    }

    function setRiskLevel(point: Point, value: number) {
        riskLevel[point.row][point.col] = value;
    }

    function getArea(point: Point) {
        return area[point.row][point.col];
    }

    function isFastestKnownRoute(from: Point, to: Point) {
        return getRiskLevel(from) + getArea(to) < getRiskLevel(to);
    }

    const area: number[][] = input
        .split(/\r?\n\r?\n?/)
        .filter(Boolean)
        .map(row => row.split('').map(Number));
    // additional area for 2nd star
    {
        // increase cols x5
        area.forEach(row => {
            const tileWidth = row.length;
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < tileWidth; j++) {
                    row.push((row[j] + i) % 9 + 1);
                }
            }
        });
        // increase rows x5
        const tileHeight = area.length;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < tileHeight; j++) {
                const newRow = area[j].map(value => (value + i) % 9 + 1);
                area.push(newRow);
            }
        }
    }
    // console.log(area.map(it => it.join('')));


    const riskLevel: number[][] = area
        .map(row => row.map(() => Number.MAX_SAFE_INTEGER));
    riskLevel[0][0] = 0;

    // FIFO queue
    const nextMoves: { from: Point, to: Point } [] = [
        {from: {row: 0, col: 0}, to: {row: 1, col: 0}},
        {from: {row: 0, col: 0}, to: {row: 0, col: 1}}
    ];

    const result = [];
    while (nextMoves.length > 0) {
        const step = nextMoves.pop()!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!; // why is this assertion legal!?
        if (step.to.row === area.length - 1 && step.to.col === area[0].length - 1) {
            // reached bottom right corner
            result.push(getRiskLevel(step.from) + getArea(step.to));
        } else if (isInBounds(area, step.to) && isFastestKnownRoute(step.from, step.to)) {
            setRiskLevel(step.to, getRiskLevel(step.from) + getArea(step.to));
            nextMoves.unshift({from: step.to, to: {row: step.to.row + 1, col: step.to.col}}); // down
            nextMoves.unshift({from: step.to, to: {row: step.to.row, col: step.to.col + 1}}); // right
            nextMoves.unshift({from: step.to, to: {row: step.to.row - 1, col: step.to.col}}); // up
            nextMoves.unshift({from: step.to, to: {row: step.to.row, col: step.to.col - 1}}); // left
            // optimization to always take the lowest risk point as the next move
            nextMoves.sort((a, b) => getRiskLevel(b.from) - getRiskLevel(a.from))
        }
    }
    return result.sort((a, b) => a - b)[0];
}
