import { readFileSync } from 'fs';

/**
 * https://adventofcode.com/2021/day/{DAY_WITHOUT_ZERO}
 */
const input = readFileSync('./december{DAY_WITH_ZERO}.txt', 'utf-8');

console.log('star 1:');
console.log(star1());
// console.log('star 2:');
// console.log(star2());

function star1() {
    return input
        .split(/\r?\n\r?\n?/)
        .filter(Number)
        .map(Number)

}

function star2() {
}
