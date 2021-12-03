import { readFileSync } from 'fs';

/**
 * https://adventofcode.com/2021/day/3
 */
const input = readFileSync('./december03.txt', 'utf-8');

console.log('star 1:');
console.log(star1());
console.log('star 2:');
console.log(star2());

function star1() {
    const inputAsNumbers = input
        .split(/\r?\n\r?\n?/)
        .filter(Boolean)
        .map(it => it.split('').map(Number))
    const onesCount = inputAsNumbers
        .reduce((previousValue, currentValue) => {
            for (let i = 0; i < previousValue.length; i++) {
                previousValue[i] += currentValue[i];
            }
            return previousValue;
        })
    // console.log({onesCount});
    let gammaRate = 0;
    for (let i = onesCount.length - 1; i >= 0; i--) {
        if (onesCount[i] > inputAsNumbers.length / 2) {
            gammaRate |= 1 << onesCount.length -1 - i;
            // console.log(`[i=${i}]:${1 << i} => ${gammaRate}`);
        }
    }
    let epsilonRate = 0;
    for (let i = 0; i < onesCount.length; i++) {
        epsilonRate |= 1 << i;
    }
    epsilonRate ^= gammaRate;
    return gammaRate * epsilonRate;
}

function star2() {
    function toDecimal(nums: number[]) {
        let decimalNum = 0;
        for (let i = nums.length - 1; i >= 0; i--) {
            if (nums[i] === 1) {
                decimalNum |= 1 << nums.length - 1 - i;
            }
        }
        return decimalNum;
    }

    function getOxygenRating(filteredArray: number[][]) {
        let currentBit = 0;
        while (filteredArray.length > 1) {
            const onesCount = filteredArray.reduce((acc, currentValue) => currentValue[currentBit] === 1 ? acc + 1 : acc, 0);
            const filterByOneOrZero = onesCount >= filteredArray.length / 2 ? 1 : 0;
            filteredArray = filteredArray.filter(it => it[currentBit] === filterByOneOrZero);
            currentBit++;
        }
        return toDecimal(filteredArray[0]);
    }

    function getCo2Rating(filteredArray: number[][]) {
        let currentBit = 0;
        while (filteredArray.length > 1) {
            const onesCount = filteredArray.reduce((acc, currentValue) => currentValue[currentBit] === 1 ? acc + 1 : acc, 0);
            const filterByOneOrZero = onesCount < filteredArray.length / 2 ? 1 : 0;
            filteredArray = filteredArray.filter(it => it[currentBit] === filterByOneOrZero);
            currentBit++;
        }
        return toDecimal(filteredArray[0]);
    }


    const inputAsNumbers = input
        .split(/\r?\n\r?\n?/)
        .filter(Boolean)
        .map(it => it.split('').map(Number))

    let oxygenRating = getOxygenRating([...inputAsNumbers]);
    let co2Rating = getCo2Rating([...inputAsNumbers]);
    return co2Rating * oxygenRating;
}
