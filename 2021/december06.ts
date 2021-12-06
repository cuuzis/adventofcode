import { readFileSync } from 'fs';

/**
 * https://adventofcode.com/2021/day/6
 */
const input = readFileSync('./december06.txt', 'utf-8');

console.log('star 1:');
console.log(star1());
console.log('star 2:');
console.log(star2());

function simulate(days: number) {
    const fishSchool = input
        .split(',')
        .filter(Number)
        .map(Number)
        .reduce((acc, currentValue) => {
            acc[currentValue]++;
            return acc;
        }, [0,0,0,0,0,0,0,0,0]);
    for (let day = 1; day <= days; day++) {
        const newFishes = fishSchool[0];
        fishSchool[0] = 0;
        for (let i = 0; i < 8; i++) {
            fishSchool[i] = fishSchool[i + 1];
        }
        fishSchool[6] += newFishes;
        fishSchool[8] = newFishes;
        // console.log(`${day}: ${fishSchool}=${fishSchool.reduce((acc, currentValue) => acc + currentValue)}`)
    }
    return fishSchool.reduce((acc, currentValue) => acc + currentValue);
}

function star1() {
    return simulate(80)
}

function star2() {
    return simulate(256)
}
