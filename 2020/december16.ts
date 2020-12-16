import {readFileSync} from 'fs';


const input = readFileSync('./december16.txt', 'utf-8');

console.log(star1());
console.log(star2());

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

    const intervals = parts[0]
        .match(/\d+-\d+/gm)
        .map(interval => ({
            from: Number.parseInt(interval.split(/-/)[0]),
            to: Number.parseInt(interval.split(/-/)[1])
        }))

    return parts[2]
        .match(/\d+/gm)
        .map(it => Number.parseInt(it))
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

    const ruleKeys = parts[0].match(/.*:/gm)
    const rules: {from: number, to: number}[][] =
        parts[0]
            .split(/\r?\n/)
            .map(ruleStr => ruleStr
                // remove rule key
                .match(/\d.*/)[0]
                // convert to [rule row][rules]
                .match(/\d+-\d+/g)
                .map(interval => ({
                    from: Number.parseInt(interval.split(/-/)[0]),
                    to: Number.parseInt(interval.split(/-/)[1])
                })))

    const yourTicket = parseTickets(parts[1])[0]
    const nearbyTickets: number[][] = parseTickets(parts[2])

    // find valid columns for rule keys
    const validColumns = {}
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
    // console.log(validColumns)

    // eliminate keys used in single place
    let key
    let keysToCheck = ruleKeys
    do {
        key = null
        for (let k of keysToCheck) {
            if (validColumns[k].length == 1) {
                key = k
                break
            }
        }
        if (key != null) {
            keysToCheck = keysToCheck.filter(it => it !== key)
            for (let k in validColumns) {
                if (k != key) {
                    validColumns[k] = validColumns[k].filter(it => it !== validColumns[key][0])
                }
            }
        }
    } while (key != null)
    // console.log(validColumns)

    return Object.entries(validColumns)
        .filter(entry => entry[0].startsWith('departure'))
        .map(entry => entry[1][0])
        .reduce((acc, num) => acc * yourTicket[num], 1)
}



