import { readFileSync } from 'fs';

/**
 * https://adventofcode.com/2021/day/9
 */
const input = readFileSync('./december09.txt', 'utf-8');

console.log('star 1:');
console.log(star1());
console.log('star 2:');
console.log(star2());

function isLowest(area: number[][], i: number, j: number) {
    for (let i1 = Math.max(0, i - 1); i1 < Math.min(area.length, i + 2); i1++) {
        for (let j1 = Math.max(0, j - 1); j1 < Math.min(area[0].length, j + 2); j1++) {
            // oops, neighbours on the corners were not counted :)
            if (i1 !== i && j1 != j) {
                continue;
            }

            if (!(i == i1 && j == j1) && area[i1][j1] <= area[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function star1() {
    const area = input
        .split(/\r?\n\r?\n?/)
        .filter(Boolean)
        .map(it => it.split('').map(Number))
    let sum = 0;
    for (let i = 0; i < area.length; i++) {
        for (let j = 0; j < area[i].length; j++) {
            if (isLowest(area, i, j)) {
                sum += area[i][j] + 1;
            }
        }
    }
    return sum;
}

function star2() {
    function getBasinArea(ii: number, jj: number): number {
        // if basin boundary exceeded, return 0
        if (ii < 0 || jj < 0 || ii >= area.length || jj >= area[0].length || area[ii][jj] > 8) {
            return 0;
        }
        // otherwise mark location as out of boundary and recursively walk its neighbours
        area[ii][jj] = 99;
        return 1 +
            getBasinArea(ii + 1, jj) +
            getBasinArea(ii, jj + 1) +
            getBasinArea(ii - 1, jj) +
            getBasinArea(ii, jj - 1);
    }

    const area = input
        .split(/\r?\n\r?\n?/)
        .filter(Boolean)
        .map(it => it.split('').map(Number))

    let basinSizes = [];
    for (let i = 0; i < area.length; i++) {
        for (let j = 0; j < area[i].length; j++) {
            if (isLowest(area, i, j)) {
                basinSizes.push(getBasinArea(i, j));
            }
        }
    }
    const basinSizesDesc = basinSizes.sort((a, b) => b - a);

    // multiply 3 largest basins
    let result = 1;
    for (let i = 0; i < 3; i++) {
        result *= basinSizesDesc[i];
    }
    return result;
}
