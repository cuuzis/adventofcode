import { readFileSync } from 'fs';

/**
 * https://adventofcode.com/2021/day/5
 */
const input = readFileSync('./december05.txt', 'utf-8');

console.log('star 1:');
console.log(star1());
console.log('star 2:');
console.log(star2());

type Line = {
    x1: number,
    y1: number,
    x2: number,
    y2: number
}

function star1() {
    const lines = input
        .split(/\r?\n\r?\n?/)
        .filter(Boolean)
        .map(it => it.split(/ -> |,/).map(Number))
        .map(it => ({x1: it[0],y1: it[1], x2: it[2], y2: it[3]} as Line))
    const maxX = lines.reduce((acc, currentValue) => Math.max(acc, Math.max(currentValue.x1, currentValue.x2)), 0)
    const maxY = lines.reduce((acc, currentValue) => Math.max(acc, Math.max(currentValue.y1, currentValue.y2)), 0)

    // iterate through all points on plane
    let pointsWithTwoLines = 0;
    for (let x = 0; x <= maxX; x++) {
        for (let y = 0; y <= maxY; y++) {
            const linesInPoint = lines.filter(it =>
                    // horizontal line crosses point
                    (it.x1 === x && it.x2 === x && it.y1 <= y && it.y2 >= y) ||
                    (it.x1 === x && it.x2 === x && it.y1 >= y && it.y2 <= y) ||
                    // vertical line crosses point
                    (it.y1 === y && it.y2 === y && it.x1 <= x && it.x2 >= x) ||
                    (it.y1 === y && it.y2 === y && it.x1 >= x && it.x2 <= x)
            )
            if (linesInPoint.length > 1) {
                pointsWithTwoLines++;
            }
        }
    }
    return pointsWithTwoLines
}

// copy-paste star1() with additional check for 'diagonal line crosses point'
function star2() {
    const lines = input
        .split(/\r?\n\r?\n?/)
        .filter(Boolean)
        .map(it => it.split(/ -> |,/).map(Number))
        .map(it => ({x1: it[0],y1: it[1], x2: it[2], y2: it[3]} as Line))
    const maxX = lines.reduce((acc, currentValue) => Math.max(acc, Math.max(currentValue.x1, currentValue.x2)), 0)
    const maxY = lines.reduce((acc, currentValue) => Math.max(acc, Math.max(currentValue.y1, currentValue.y2)), 0)

    // iterate through all points on plane
    let pointsWithTwoLines = 0;
    for (let x = 0; x <= maxX; x++) {
        for (let y = 0; y <= maxY; y++) {
            const linesInPoint = lines.filter(it =>
                // horizontal line crosses point
                (it.x1 === x && it.x2 === x && it.y1 <= y && it.y2 >= y) ||
                (it.x1 === x && it.x2 === x && it.y1 >= y && it.y2 <= y) ||
                // vertical line crosses point
                (it.y1 === y && it.y2 === y && it.x1 <= x && it.x2 >= x) ||
                (it.y1 === y && it.y2 === y && it.x1 >= x && it.x2 <= x) ||
                // diagonal line crosses point
                ((Math.abs(x - it.x1) === Math.abs(y - it.y1) && Math.abs(it.x2 - x) === Math.abs(it.y2 - y)) && // check that endless diagonal line would cross the point
                    (((x >= it.x1 && x <= it.x2) || (x <= it.x1 && x >= it.x2)) && ((y >= it.y1 && y <= it.y2) || (y <= it.y1 && y >= it.y2)))  // check that point is within the line start/end boundaries
                )
            )
            if (linesInPoint.length > 1) {
                pointsWithTwoLines++;
            }
        }
    }
    return pointsWithTwoLines
}
