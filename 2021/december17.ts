import { readFileSync } from 'fs';

/**
 * https://adventofcode.com/2021/day/17
 */
const input = readFileSync('./december17.txt', 'utf-8');



const t = '23,-10  25,-9   27,-5   29,-6   22,-6   21,-7   9,0     27,-7   24,-5\n' +
    '25,-7   26,-6   25,-5   6,8     11,-2   20,-5   29,-10  6,3     28,-7\n' +
    '8,0     30,-6   29,-8   20,-10  6,7     6,4     6,1     14,-4   21,-6\n' +
    '26,-10  7,-1    7,7     8,-1    21,-9   6,2     20,-7   30,-10  14,-3\n' +
    '20,-8   13,-2   7,3     28,-8   29,-9   15,-3   22,-5   26,-8   25,-8\n' +
    '25,-6   15,-4   9,-2    15,-2   12,-2   28,-9   12,-3   24,-6   23,-7\n' +
    '25,-10  7,8     11,-3   26,-7   7,1     23,-9   6,0     22,-10  27,-6\n' +
    '8,1     22,-8   13,-4   7,6     28,-6   11,-4   12,-4   26,-9   7,4\n' +
    '24,-10  23,-8   30,-8   7,0     9,-1    10,-1   26,-5   22,-9   6,5\n' +
    '7,5     23,-6   28,-10  10,-2   11,-1   20,-9   14,-2   29,-7   13,-3\n' +
    '23,-5   24,-8   27,-9   30,-7   28,-5   21,-10  7,9     6,6     21,-5\n' +
    '27,-10  7,2     30,-9   21,-8   22,-7   24,-9   20,-6   6,9     29,-5\n' +
    '8,-2    27,-8   30,-5   24,-7'
const tt = t
    .split(/\n| +/)
    .map(it => [Number(it.split(',')[0]),Number(it.split(',')[1])])
    .sort((a, b) => a[1] < b[1] ? 1 : -1)
    .sort((a, b) => a[0] < b[0] ? 1 : -1)
// console.log(tt)

console.log('star 1:');
console.log(star1());
console.log('star 2:');
console.log(star2());

function findHighestVelocityY(y1: number, y2: number) {
    for (let startVelocityY = 10000; startVelocityY > 0; startVelocityY--) {
        let highestDistanceY = 0;
        let velocityY = startVelocityY;
        let distanceY = 0;
        for (let i = 0; i < 10000; i++) {
            distanceY += velocityY;
            velocityY--;
            if (distanceY < y2) {
                break;
            }
            if (distanceY > highestDistanceY) {
                highestDistanceY = distanceY;
            }
        }
        if (distanceY >= y1 && distanceY <= y2) {
            return {startVelocityY, highestDistanceY};
        }
    }
    return null;
}

function star1() {
    const notNumberCharactersRegEx = /[^0-9|-]+/;
    const inputNumbers = input
        .split(notNumberCharactersRegEx)
        .filter(Number)
        .map(Number);
    const x1 = inputNumbers[0];
    const x2 = inputNumbers[1];
    const y1 = inputNumbers[2];
    const y2 = inputNumbers[3];


    const possibleVelocitiesX = [];

    let stepSize = 1;
    let startVelocityX = 0;
    let distanceX = 0;
    while (distanceX <= x2) {
        if (distanceX >= x1) {
            possibleVelocitiesX.push(startVelocityX);
        }
        distanceX += stepSize;
        stepSize++;
        startVelocityX++;
    }
    return findHighestVelocityY(y1, y2)?.highestDistanceY;
}


type TargetStatus = 'HIT' | 'HIGHER' | 'LOWER';

function targetStatus(y1: number, y2: number, startVelocityY: number, steps: number, isX: boolean): TargetStatus {
    let velocityY = startVelocityY;
    let distanceY = 0;
    for (let i = 0; i < steps; i++) {
        distanceY += velocityY;
        velocityY--;
        if (isX && velocityY < 0) {
            velocityY = 0;
        }
    }
    if (distanceY > y2) {
        return 'HIGHER';
    } else if (distanceY < y1) {
        return 'LOWER';
    } else {
        return 'HIT';
    }
}

function findAllVelocities(y1: number, y2: number, steps: number, isX: boolean) {
    let startVelocityY = -70;
    let searchWindow = 10000;
    // binary search for a hit
    while (searchWindow > 0) {
        if (searchWindow === 1) {
            searchWindow = 0
        } else {
            searchWindow = Math.round(searchWindow / 2);
        }
        const aimOnTarget = targetStatus(y1, y2, startVelocityY, steps, isX)
        // console.log({searchWindow, startVelocityY, aimOnTarget})
        if (aimOnTarget === 'LOWER') {
            startVelocityY += searchWindow;
        } else if (aimOnTarget === 'HIGHER') {
            startVelocityY -= searchWindow;
        } else if (aimOnTarget === 'HIT') {
            const result = [];
            result.push(startVelocityY);
            let startVelocityY1 = startVelocityY + 1;
            while (targetStatus(y1, y2, startVelocityY1, steps, isX) == 'HIT') {
                result.push(startVelocityY1++);
            }
            startVelocityY1 = startVelocityY - 1;
            while (targetStatus(y1, y2, startVelocityY1, steps, isX) == 'HIT') {
                result.push(startVelocityY1--);
            }
            return result;
        }
    }
    return [];
}

function star2() {
    const notNumberCharactersRegEx = /[^0-9|-]+/;
    const inputNumbers = input
        .split(notNumberCharactersRegEx)
        .filter(Number)
        .map(Number);
    const x1 = inputNumbers[0];
    const x2 = inputNumbers[1];
    const y1 = inputNumbers[2];
    const y2 = inputNumbers[3];


    // find all velocities
    const result: [number, number][] = [];
    for (let steps = 1; steps <= 10000; steps++) {
        const possibleVelocitiesX = findAllVelocities(x1, x2, steps, true);
        if (possibleVelocitiesX.length > 0) {
            const possibleVelocitiesY = findAllVelocities(y1, y2, steps, false);
            // console.log({steps, possibleVelocitiesX, possibleVelocitiesY})
            for (let velocityX of possibleVelocitiesX) {
                for (let velocityY of possibleVelocitiesY) {
                    if (!result.find(it => it[0] === velocityX && it[1] === velocityY))
                    result.push([velocityX, velocityY]);
                }
            }
        }
    }
    return result.length;

}
