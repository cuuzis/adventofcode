import {readFileSync} from 'fs';

/**
 * https://adventofcode.com/2020/day/18
 */
const input = readFileSync('./december18.txt', 'utf-8');

console.log(star1()); // 800602729153
console.log(star2()); // 92173009047076


/**
 * Sum or multiply numbers together, left to right
 */
function evaluateOperations(expression: string): string {
    let result = 0
    let lastOperation = '+'
    for (let c of expression.split(' ')) {
        if (c == '*' || c == '+') {
            lastOperation = c
        } else {
            const num = Number.parseInt(c)
            if (lastOperation == '+') {
                result += num
            } else {
                result *= num
            }
        }
    }
    return String(result)
}

function star1() {
    function evaluate(expression: string): number {
        while (/[+*]/.test(expression)) {
            expression = expression
                // evaluate parts without brackets that start and end with a digit
                .replace(/\d+.[+*][^()]*\d+/, evaluateOperations)
                // remove brackets wrapping a single number
                .replace(/\(\d+\)/, x => x.substring(1, x.length - 1))
        }
        return Number.parseInt(expression)
    }

    return  input
        .split(/\r\n/)
        .filter(row => row != '')
        .reduce((acc, line) => acc + evaluate(line), 0)
}


function star2() {
    function evaluate(expression: string): number {
        expression = '(' + expression + ')' // hack to multiply last numbers :)
        while (/[+*]/.test(expression)) {
                expression = expression
                    // evaluate addition only parts
                    .replace(/\d+.[+][^()*]*\d+/, evaluateOperations)
                    // evaluate multiplication parts within brackets
                    .replace(/(?<=\()\d+.[*][^()+]*\d+(?=\))/, evaluateOperations)
                    // remove brackets wrapping a single number
                    .replace(/\(\d+\)/, x => x.substring(1, x.length - 1))
        }
        return Number.parseInt(expression)
    }

    return  input
        .split(/\r\n/)
        .filter(row => row != '')
        .reduce((acc, line) => acc + evaluate(line), 0)
}



