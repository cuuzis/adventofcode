import { readFileSync } from 'fs';

/**
 * https://adventofcode.com/2021/day/13
 */
const input = readFileSync('./december13.txt', 'utf-8');

console.log('star 1:');
console.log(star1());
console.log('star 2:');
console.log(star2());

type Point = { x: number, y: number }


function fold(points: Point[], foldDirection: string, foldAlong: number) {
    if (foldDirection === 'x') {
        for (let point of points) {
            if (point.x > foldAlong) {
                point.x = 2 * foldAlong - point.x;
            }
        }
    } else {
        for (let point of points) {
            if (point.y > foldAlong) {
                point.y = 2 * foldAlong - point.y;
            }
        }
    }
    // remove duplicates
    return points.filter((value, index, array) => array.findIndex(it => it.x === value.x && it.y === value.y) === index);
}

function star1() {
    let points = input
        .split(/\r?\n\r?\n?/)
        .filter(it => it.match(/,/))
        .map(it => ({x: Number(it.split(',')[0]), y: Number(it.split(',')[1])} as Point))
    input
        .split(/\r?\n\r?\n?/)
        .filter(it => it.match(/fold/))
        .filter((value, index) => index === 0)
        .forEach(foldCommand => {
            const foldDirection = foldCommand[11];
            const foldAlong = Number(foldCommand.match(/\d+/)![0]);
            points = fold(points, foldDirection, foldAlong);
        })
    // return points.sort((a, b) => a.y - b.y).sort((a, b) => a.x - b.x);
    return points.length;
}

function star2() {
    let points = input
        .split(/\r?\n\r?\n?/)
        .filter(it => it.match(/,/))
        .map(it => ({x: Number(it.split(',')[0]), y: Number(it.split(',')[1])} as Point))
    input
        .split(/\r?\n\r?\n?/)
        .filter(it => it.match(/fold/))
        .forEach(foldCommand => {
            const foldDirection = foldCommand[11];
            const foldAlong = Number(foldCommand.match(/\d+/)![0]);
            points = fold(points, foldDirection, foldAlong);
        })

    // visualize
    let result = [];
    const maxX = points.sort((a, b) => b.x - a.x)[0].x;
    const maxY = points.sort((a, b) => b.y - a.y)[0].y;
    for (let i = 0; i <= maxY; i++) {
        let row = '';
        for (let j = 0; j <= maxX; j++) {
            if (points.find(it => it.y === i && it.x === j)) {
                row += '#';
            } else {
                row += '.';
            }
        }
        result.push(row);
    }
    return result;
}
