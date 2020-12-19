import {readFileSync} from 'fs';

/**
 * https://adventofcode.com/2020/day/19
 */
const input = readFileSync('./december19.txt', 'utf-8');

console.log(star1()); // 233
console.log(star2()); // 396


function star1() {
    function resolve(ruleStr: string): string {
        if (ruleStr == '"a"') {
            return 'a'
        } else if (ruleStr == '"b"') {
            return 'b'
        }
        return '(' + ruleStr.replace(/\d+/g, num => resolve(rules[num])) + ')'
    }

    const parts = input.split(/\r?\n\r?\n/)
    const rules: {[ruleKey: string]:string} = {}
    parts[0].split(/\r?\n/).forEach(line => {
        const ruleKey = line.substring(0, line.indexOf(':'))
        const ruleString = line.substring(line.indexOf(':') + 2)
        rules[ruleKey] = ruleString
    })


    const regex = new RegExp('^' + resolve(rules['0']).replace(/ /g, '') + '$', 'gm')
    return (parts[1].match(regex) || []).length
}


// solved by interrupting infinite loop at depth 30
function star2() {
    function resolve(ruleStr: string, depth: number): string {
        if (ruleStr == '"a"') {
            return 'a'
        } else if (ruleStr == '"b"') {
            return 'b'
        }
        if (depth > 30) return "" // recursion breaker
        return '(' + ruleStr.replace(/\d+/g, num => resolve(rules[num], depth + 1)) + ')'
    }

    const parts = input
        // replace rules `8: 42` and `11: 42 31` with the following: `8: 42 | 42 8` and `11: 42 31 | 42 11 31`
        .replace('8: 42', '8: 42 | 42 8')
        .replace('11: 42 31', '11: 42 31 | 42 11 31')
        .split(/\r?\n\r?\n/)
    const rules: {[ruleKey: string]:string} = {}
    parts[0].split(/\r?\n/).forEach(line => {
        const ruleKey = line.substring(0, line.indexOf(':'))
        const ruleString = line.substring(line.indexOf(':') + 2)
        rules[ruleKey] = ruleString
    })


    const regex = new RegExp('^' + resolve(rules['0'], 0).replace(/ /g, '') + '$', 'gm')
    return (parts[1].match(regex) || []).length
}



