import { readFileSync } from 'fs';

/**
 * https://adventofcode.com/2020/day/8
 */
const input = readFileSync('./december08.txt', 'utf-8');

console.log(star1()); // 1818
console.log(star2()); // 631


function star1() {
    const lines = input.split(/\r?\n/);
    return accumulate(lines);
}

function star2() {
    const lines = input.split(/\r?\n/).filter(it => it !== '');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const command = line.split(' ')[0];
        if (command === 'jmp') {
            const value = Number.parseInt(line.split(' ')[1]);
            lines[i] = 'nop ' + value;
            const acc = accumulate(lines);
            if (typeof acc === 'string') {
                return Number.parseInt(acc.split(' ')[1]);
            }
            lines[i] = 'jmp ' + value;
        } else if (command === 'nop') {
            const value = Number.parseInt(line.split(' ')[1]);
            lines[i] = 'jmp ' + value;
            const acc = accumulate(lines);
            if (typeof acc === 'string') {
                return Number.parseInt(acc.split(' ')[1]);
            }
            lines[i] = 'nop ' + value;
        }
    }
}

function accumulate(lines: string[]) {
    const visitedLines = [];
    for (const line of lines) {
        visitedLines.push(false);
    }
    let pointer = 0;
    let accumulator = 0;
    while (!visitedLines[pointer]) {
        if (pointer >= lines.length) {
            return 'finished: ' +  accumulator;
        }
        const line = lines[pointer];
        const command = line.split(' ')[0];
        const value = Number.parseInt(line.split(' ')[1]);
        visitedLines[pointer] = true;
        if (command === 'nop') {
            pointer++;
        } else if (command === 'acc') {
            accumulator += value;
            pointer++;
        } else if (command === 'jmp') {
            pointer += value;
        }
    }
    return accumulator;
}


