import { readFileSync } from 'fs';

/**
 * https://adventofcode.com/2021/day/14
 */
const input = readFileSync('./december14.txt', 'utf-8');

console.log('star 1:');
console.log(star1());
console.log('star 2:');
console.log(star2());

function reinforce(steps: number) {
    let firstPair = '';
    let lastPair = '';
    let pairs: {[key: string]: number} = {};
    input
        .split(/\r?\n\r?\n?/)[0]
        .split('')
        .forEach((value, index, array) => {
            if (index + 1 < array.length) {
                pairs[value + array[index + 1]] = 1;
            }
            if (index === 0 ) {
                firstPair = value;
            }
            if (index === array.length - 1) {
                lastPair = value;
            }
        });


    const insertionRules: {[key: string]: [string, string]} = {};
    input
        .split(/\r?\n\r?\n?/)
        .filter(it => it.match(/->/))
        .forEach(it => {
            const original = it.split(' -> ')[0];
            const insertion = it.split(' -> ')[1];
            return insertionRules[original] = [original[0] + insertion, insertion + original[1]];
        });

    // update count of pairs
    for (let step = 0; step < steps; step++) {
        const newPairs: {[key: string]: number} = {};
        for (let pairsKey in pairs) {
            if (pairs[pairsKey] > 0) {
                for (let newPair of insertionRules[pairsKey]) {
                    if (newPairs[newPair] > 0) {
                        newPairs[newPair] += pairs[pairsKey];
                    } else {
                        newPairs[newPair] = pairs[pairsKey];
                    }
                }
            }
        }
        pairs = newPairs;
    }

    // count letters within in pairs
    const letterCount: {[key: string]: number} = {};
    for (let pairsKey in pairs) {
        for (let letter of pairsKey.split('')) {
            if (letterCount[letter] > 0) {
                letterCount[letter] += pairs[pairsKey];
            } else {
                letterCount[letter] = pairs[pairsKey];
            }
        }
    }
    letterCount[firstPair]++;
    letterCount[lastPair]++;
    // every was now counted twice
    for (let letterCountKey in letterCount) {
        letterCount[letterCountKey] = letterCount[letterCountKey] / 2;
    }

    // get most/least common letters
    // console.log({letterCount});
    let mostCommonLetterCount = 0;
    let leastCommonLetterCount = Number.MAX_SAFE_INTEGER;
    for (let letterCountKey in letterCount) {
        if (letterCount[letterCountKey] > mostCommonLetterCount) {
            mostCommonLetterCount = letterCount[letterCountKey];
        }
        if (letterCount[letterCountKey] < leastCommonLetterCount) {
            leastCommonLetterCount = letterCount[letterCountKey];
        }
    }

    return mostCommonLetterCount - leastCommonLetterCount;
}

function star1() {
    return reinforce(10)
}


function star2() {
    return reinforce(40)
}
