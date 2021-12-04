import { readFileSync } from 'fs';

/**
 * https://adventofcode.com/2021/day/4
 */
const input = readFileSync('./december04.txt', 'utf-8');

console.log('star 1:');
console.log(star1());
console.log('star 2:');
console.log(star2());


interface BingoSquare {
    nums: number[][];
    markings: boolean[][];
    bingoWonAs?: number;
}


function calculateScore(bingoSquare: BingoSquare, calledNum: number) {
    const squareSize = bingoSquare.nums.length;
    let sum = 0;
    for (let i = 0; i < squareSize; i++) {
        for (let j = 0; j < squareSize; j++) {
            if (!bingoSquare.markings[i][j]) {
                sum += bingoSquare.nums[i][j];
            }
        }
    }
    return sum * calledNum;
}


function star1() {

    // parse input into BingoSquare
    const inputRows = input
        .split(/\r?\n\r?\n?/)
        .filter(Boolean)
    const calledNumbers = inputRows.shift()!.split(',').map(Number)
    const bingoSquares: BingoSquare[] = [];
    const squareSize = 5;
    while (inputRows.length > 0) {
        const bingoSquareNums = [];
        const bingoSquareMarkings = [];
        for (let i = 0; i < squareSize; i++) {
            const bingoRow = inputRows.shift()!.split(' ').filter(Boolean).map(Number);
            bingoSquareNums.push(bingoRow);
            bingoSquareMarkings.push(bingoRow.map(() => false));
        }
        bingoSquares.push({nums: bingoSquareNums, markings: bingoSquareMarkings});
    }

    // iterate through called numbers
    while (calledNumbers.length > 0) {
        const calledNum = calledNumbers.shift() as number;
        for (let bingoSquare of bingoSquares) {
            for (let [rowIdx, row] of bingoSquare.nums.entries()) {
                const colIdx = row.findIndex(it => it === calledNum);
                if (colIdx !== -1) {
                    // add marking
                    bingoSquare.markings[rowIdx][colIdx] = true;
                    // check for bingo row
                    const bingoRow = bingoSquare.markings[rowIdx].every(it => it);
                    if (bingoRow) {
                        console.log(`bingo row ${rowIdx}`)
                        console.log(bingoSquare)
                        return calculateScore(bingoSquare, calledNum);
                    }

                    // check for bingo column
                    let bingoCol = true;
                    for (let i = 0; i < squareSize; i++) {
                        bingoCol = bingoCol && bingoSquare.markings[colIdx][i]
                    }
                    if (bingoCol) {
                        console.log(`bingo col ${colIdx}`)
                        console.log(bingoSquare)
                        return calculateScore(bingoSquare, calledNum);
                    }
                }
            }
        }
    }
}

// lazy copy-paste with added sequence of wins to the board. Keeps updating boards that already won.
function star2() {

    // parse input into BingoSquare
    const inputRows = input
        .split(/\r?\n\r?\n?/)
        .filter(Boolean)
    const calledNumbers = inputRows.shift()!.split(',').map(Number)
    const bingoSquares: BingoSquare[] = [];
    const squareSize = 5;
    while (inputRows.length > 0) {
        const bingoSquareNums = [];
        const bingoSquareMarkings = [];
        for (let i = 0; i < squareSize; i++) {
            const bingoRow = inputRows.shift()!.split(' ').filter(Boolean).map(Number);
            bingoSquareNums.push(bingoRow);
            bingoSquareMarkings.push(bingoRow.map(() => false));
        }
        bingoSquares.push({nums: bingoSquareNums, markings: bingoSquareMarkings});
    }

    // iterate through called numbers
    let currentBingo = 1;
    while (calledNumbers.length > 0) {
        const calledNum = calledNumbers.shift() as number;
        for (let bingoSquare of bingoSquares) {
            for (let [rowIdx, row] of bingoSquare.nums.entries()) {
                const colIdx = row.findIndex(it => it === calledNum);
                if (colIdx !== -1) {
                    // add marking
                    bingoSquare.markings[rowIdx][colIdx] = true;
                    // check for bingo row
                    const bingoRow = bingoSquare.markings[rowIdx].every(it => it);
                    if (bingoRow && !bingoSquare.bingoWonAs) {
                        bingoSquare.bingoWonAs = currentBingo++;
                        if (bingoSquare.bingoWonAs === bingoSquares.length) {
                            console.log(`bingo row ${rowIdx}`);
                            console.log(bingoSquare);
                            return calculateScore(bingoSquare, calledNum);
                        }
                    }

                    // check for bingo column
                    let bingoCol = true;
                    for (let i = 0; i < squareSize; i++) {
                        bingoCol = bingoCol && bingoSquare.markings[i][colIdx]
                    }
                    if (bingoCol && !bingoSquare.bingoWonAs) {
                        bingoSquare.bingoWonAs = currentBingo++;
                        if (bingoSquare.bingoWonAs === bingoSquares.length) {
                            console.log(`bingo col ${colIdx}`)
                            console.log(bingoSquare)
                            return calculateScore(bingoSquare, calledNum);
                        }
                    }
                }
            }
        }
    }

}
