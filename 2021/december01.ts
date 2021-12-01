import {readFileSync} from 'fs';

/**
 * https://adventofcode.com/2021/day/1
 */
const input = readFileSync('./december01.txt', 'utf-8');

console.log('star 1:');
console.log(star1());
console.log('star 2:');
console.log(star2());

function star1(): number {
    let increasesCount = 0;
    input
        .split(/\r?\n\r?\n?/)
        .filter(Number)
        .map(Number)
        .reduce((previousValue, currentValue) => {
            if (previousValue < currentValue) {
                increasesCount++;
            }
            return currentValue;
        })
    return increasesCount;
}



function star2(): number {
    type Accumulator = {
        window: number[]
        lastSum: number;
        increasesCount: number
    }

    return input
        .split(/\r?\n\r?\n?/)
        .filter(Number)
        .map(Number)
        .reduce((acc, currentValue) => {
            acc.window.push(currentValue);
            if (acc.window.length > 3) {
                acc.window.shift();
            }
            if (acc.window.length === 3) {
                const currentSum = acc.window.reduce((a, b) => a + b);
                if (currentSum > acc.lastSum) {
                    acc.increasesCount++;
                }
                // console.log(`window: ${acc.window}\t sum: ${currentSum}\t lastSum: ${acc.lastSum}\t increase: ${currentSum > acc.lastSum}`)
                acc.lastSum = currentSum;
            }
            return acc;
        }, {window: [], lastSum: Number.MAX_SAFE_INTEGER, increasesCount: 0} as Accumulator)
        .increasesCount;
}
