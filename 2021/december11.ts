import { readFileSync } from 'fs';

/**
 * https://adventofcode.com/2021/day/11
 */
const input = readFileSync('./december11.txt', 'utf-8');

console.log('star 1:');
console.log(star1());
console.log('star 2:');
console.log(star2());


function star1() {

    // copy paste from day 9
    function updateNeghbours(i: number, j: number) {
        if (area[i][j] > 9) {
            // mark as flashed to set to 0 afterwards
            area[i][j] = -999;
            flashes++;
            // increase adjacent octopus energy
            for (let i1 = Math.max(0, i - 1); i1 < Math.min(area.length, i + 2); i1++) {
                for (let j1 = Math.max(0, j - 1); j1 < Math.min(area[0].length, j + 2); j1++) {
                    area[i1][j1]++;
                    updateNeghbours(i1, j1);
                }
            }
        }
    }

    const area = input
        .split(/\r?\n\r?\n?/)
        .filter(Boolean)
        .map(it => it.split('').map(Number))
    let flashes = 0;

    for (let step = 0; step < 100; step++) {
        // increase energy by 1
        for (let i = 0; i < area.length; i++) {
            for (let j = 0; j < area[i].length; j++) {
                area[i][j]++;
                updateNeghbours(i, j);
            }
        }
        // reset flashed octopuses to 0
        for (let i = 0; i < area.length; i++) {
            for (let j = 0; j < area[i].length; j++) {
                if (area[i][j] < 0) {
                    area[i][j] = 0;
                }
            }
        }
    }
    return flashes;
}

function star2() {

    // copy paste from day 9
    function updateNeghbours(i: number, j: number) {
        if (area[i][j] > 9) {
            // mark as flashed to set to 0 afterwards
            area[i][j] = -999;
            // increase adjacent octopus energy
            for (let i1 = Math.max(0, i - 1); i1 < Math.min(area.length, i + 2); i1++) {
                for (let j1 = Math.max(0, j - 1); j1 < Math.min(area[0].length, j + 2); j1++) {
                    area[i1][j1]++;
                    updateNeghbours(i1, j1);
                }
            }
        }
    }

    const area = input
        .split(/\r?\n\r?\n?/)
        .filter(Boolean)
        .map(it => it.split('').map(Number))

    for (let step = 0; step < 2000; step++) {
        // increase energy by 1
        for (let i = 0; i < area.length; i++) {
            for (let j = 0; j < area[i].length; j++) {
                area[i][j]++;
                updateNeghbours(i, j);
            }
        }
        // reset flashed octopuses to 0
        let allFlashed = true;
        for (let i = 0; i < area.length; i++) {
            for (let j = 0; j < area[i].length; j++) {
                if (area[i][j] < 0) {
                    area[i][j] = 0;
                } else {
                    allFlashed = false;
                }
            }
        }
        if (allFlashed) {
            return step + 1;
        }
    }
}
