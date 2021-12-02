import {readFileSync} from 'fs';

/**
 * https://adventofcode.com/2021/day/2
 */
const input = readFileSync('./december02.txt', 'utf-8');

console.log('star 1:');
console.log(star1());
console.log('star 2:');
console.log(star2());

function star1() {
    const result = input
        .split(/\r?\n\r?\n?/)
        .filter(Boolean)
        .reduce((acc, currentValue) => {
            const positionChange = Number(currentValue.split(' ')[1]);
            if (currentValue.startsWith('forward')) {
                acc.horizontal += positionChange;
            } else if (currentValue.startsWith('down')) {
                acc.depth += positionChange;
            } else if (currentValue.startsWith('up')) {
                acc.depth -= positionChange;
            }
            return acc;
        }, {horizontal: 0, depth: 0})
    return result.horizontal * result.depth;
}



function star2() {
    const result = input
        .split(/\r?\n\r?\n?/)
        .filter(Boolean)
        .reduce((acc, currentValue) => {
            const positionChange = Number(currentValue.split(' ')[1]);
            if (currentValue.startsWith('forward')) {
                acc.horizontal += positionChange;
                acc.depth += acc.aim * positionChange;
            } else if (currentValue.startsWith('down')) {
                acc.aim += positionChange;
            } else if (currentValue.startsWith('up')) {
                acc.aim -= positionChange;
            }
            return acc;
        }, {horizontal: 0, depth: 0, aim: 0})
    return result.horizontal * result.depth;
}
