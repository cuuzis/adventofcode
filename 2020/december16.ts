import {readFileSync} from 'fs';

/**
 * https://adventofcode.com/2020/day/16
 */
const input = readFileSync('./december16.txt', 'utf-8');

console.log(star1()); // 22057
console.log(star2()); // 1093427331937

function isValid(value: number, rule: { from: number; to: number }[]) {
    for (let condition of rule) {
        if (value >= condition.from && value <= condition.to) {
            return true
        }
    }
    return false
}

function star1() {
    const parts = input.split(/\r?\n\r?\n/)

    const intervals =
        (parts[0]?.match(/\d+-\d+/gm) ?? [])
        .map(interval => ({
            from: Number.parseInt(interval.split(/-/)[0]),
            to: Number.parseInt(interval.split(/-/)[1])
        }))

    return parts[2]
        .match(/\d+/gm)
        ?.map(it => Number.parseInt(it))
        .reduce((acc, value) => acc + (isValid(value, intervals) ? 0 : value), 0)
}


function star2() {

    function isValidTicket(ticket: number[], rules: { from: number; to: number }[][]) {
        for (const value of ticket) {
            if (!rules.find(rule => isValid(value, rule))) {
                return false
            }
        }
        return true
    }

    function parseTickets(tickets: string) {
        return tickets
            .split(/\r?\n/)
            .filter(it => it !== '')
            // remove header
            .slice(1)
            // convert to [ticket row][ticket values]
            .map(ticket => ticket.split(',')
                .map(value => Number.parseInt(value)))
            .filter(ticket => isValidTicket(ticket, rules));
    }


    const parts = input.split(/\r?\n\r?\n/)

    const ruleKeys = parts[0].match(/.*:/gm) ?? []

    const rules: {from: number, to: number}[][] =
        parts[0]
            .split(/\r?\n/)
            .map(ruleStr => ruleStr
                .match(/\d+-\d+/g)
                ?.map(interval => ({
                    from: Number.parseInt(interval.split(/-/)[0]) ?? -1,
                    to: Number.parseInt(interval.split(/-/)[1]) ?? -1
                })) ?? [])

    const yourTicket = parseTickets(parts[1])[0]
    const nearbyTickets: number[][] = parseTickets(parts[2])

    // find valid columns for rule keys
    const validColumns: any = {}
    for (let ruleIdx = 0; ruleIdx < ruleKeys.length; ruleIdx++) {
        const ruleKey = ruleKeys[ruleIdx]
        const rule = rules[ruleIdx]

        // check every column if it fits for rule
        for (let i = 0; i < ruleKeys.length; i++) {
            let ruleApplies = true
            for (let ticket of nearbyTickets) {
                const value = ticket[i]
                if (!isValid(value, rule)) {
                    ruleApplies = false
                    break
                }
            }
            if (ruleApplies) {
                if (!validColumns[ruleKey]) {
                    validColumns[ruleKey] = []
                }
                validColumns[ruleKey].push(i)
            }
        }
    }
    // console.log('Rule possible columns:', validColumns)

    let keysToCheck = ruleKeys
    while (true) {
        const key = keysToCheck.find(k => validColumns[k].length == 1)
        if (key) {
            keysToCheck = keysToCheck.filter(it => it !== key)
            for (const k of keysToCheck) {
                validColumns[k] = validColumns[k].filter((it: any) => it !== validColumns[key][0])
            }
        } else {
            break
        }
    }

    // console.log('Rule assigned columns:', validColumns)

    return Object.entries(validColumns)
        .filter(entry => entry[0].startsWith('departure'))
        .map(([, second]) => (second as number[])[0])
        .reduce((acc, num) => acc * yourTicket[num], 1)
}



