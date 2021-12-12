import { readFileSync } from 'fs';

/**
 * https://adventofcode.com/2021/day/10
 */
const input = readFileSync('./december10.txt', 'utf-8');

console.log('star 1:');
console.log(star1());
console.log('star 2:');
console.log(star2());

function star1() {
    function lineScore(line: string): number {
        const stack: string[] = [];
        for (let c of line.split('')) {
            switch (c) {
                case '(':
                case '[':
                case '{':
                case '<':
                    stack.push(c)
                    break;
                case ')':
                    if (stack.pop() !== '(') {
                        return 3;
                    }
                    break;
                case ']':
                    if (stack.pop() !== '[') {
                        return 57;
                    }
                    break;
                case '}':
                    if (stack.pop() !== '{') {
                        return 1197;
                    }
                    break;
                case '>':
                    if (stack.pop() !== '<') {
                        return 25137;
                    }
                    break;
                default:
                    throw new Error('unexpected char');
            }
        }
        return 0;
    }
    return input
        .split(/\r?\n\r?\n?/)
        .filter(Boolean)
        .reduce((acc, currentValue) => acc + lineScore(currentValue), 0);

}

function star2() {
    function lineScore(line: string): number {

        function points(s: string | undefined) {
            switch (s) {
                case '(':
                    return 1;
                case '[':
                    return 2;
                case '{':
                    return 3;
                case '<':
                    return 4;
                default:
                    throw new Error('unexpected char');
            }
        }


        const stack: string[] = [];
        for (let c of line.split('')) {
            switch (c) {
                case '(':
                case '[':
                case '{':
                case '<':
                    stack.push(c)
                    break;
                case ')':
                    if (stack.pop() !== '(') {
                        return 0;
                    }
                    break;
                case ']':
                    if (stack.pop() !== '[') {
                        return 0;
                    }
                    break;
                case '}':
                    if (stack.pop() !== '{') {
                        return 0;
                    }
                    break;
                case '>':
                    if (stack.pop() !== '<') {
                        return 0;
                    }
                    break;
                default:
                    throw new Error('unexpected char');
            }
        }

        let result = 0;
        while (stack.length > 0) {
            result *= 5;
            result += points(stack.pop());
        }
        return result;
    }
    const autocompleteScores = input
        .split(/\r?\n\r?\n?/)
        .filter(Boolean)
        .reduce((acc, currentValue) => {
            const score = lineScore(currentValue);
            if (score > 0) {
                acc.push(score);
            }
            return acc;
            }, [] as number[])
        .sort((a, b) => a - b);
    return autocompleteScores[(autocompleteScores.length - 1) / 2];
}
