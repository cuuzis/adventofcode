import { readFileSync } from 'fs';

/**
 * https://adventofcode.com/2021/day/7
 */
const input = readFileSync('./december07.txt', 'utf-8');

console.log('star 1:');
console.log(star1());
console.log('star 2:');
console.log(star2());

function star1() {
    // https://stackoverflow.com/questions/45309447/calculating-median-javascript/53660837
    function median(values: number[]){
        if(values.length ===0) throw new Error("No inputs");

        values.sort(function(a,b){
            return a-b;
        });

        var half = Math.floor(values.length / 2);

        if (values.length % 2)
            return values[half];

        return (values[half - 1] + values[half]) / 2.0;
    }

    
    const crabPositions = input
        .split(',')
        .map(Number)
    const medianPosition = median(crabPositions);
    return crabPositions.reduce((acc, currentValue) => acc + Math.abs(currentValue - medianPosition), 0);
}

function star2() {
    const crabPositions = input
        .split(',')
        .map(Number)


    // generate fuel costs for all possible numbers of crab step
    const maxPosition = crabPositions.reduce((acc, currentValue) => Math.max(acc, currentValue));
    const fuelSpentOnSteps = [] as number[];
    let sum = 0;
    for (let i = 0; i < maxPosition; i++) {
        sum += i;
        fuelSpentOnSteps.push(sum);
    }

    // iterate through all destinations until the lowest one is reached
    let previousPos = Number.MAX_SAFE_INTEGER;
    for (let position = 1; position < crabPositions.length - 1; position++) {
        const nextPos = crabPositions.reduce((acc, currentValue) => acc + fuelSpentOnSteps[Math.abs(currentValue - position)], 0);
        // console.log({previousPos, nextPos})
        if (nextPos >= previousPos) {
            return previousPos;
        } else {
            previousPos = nextPos;
        }
    }
}
