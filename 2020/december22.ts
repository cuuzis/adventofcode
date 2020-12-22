import {readFileSync} from 'fs';

/**
 * https://adventofcode.com/2020/day/22
 */
const input = readFileSync('./december22.txt', 'utf-8');

console.log(star1()); // 35562
console.time('task2')
console.log(star2()); // 34424
console.timeEnd('task2')

function getInputDecks() {
    return input
        .split(/\r?\n\r?\n/)
        .map(part => part.split(/\r?\n/)
            .slice(1)
            .filter(line => line != '')
            .map(it => Number.parseInt(it))
            .reverse())
}

function countPoints(deck: number[]): number {
    let scoreMultiplier = 1
    return deck.reduce((acc, card) => acc + card * scoreMultiplier++, 0)
}

// for numbers 0 < n < 64
// stores number of the array in each 6 bits of a single integer
// [2, 5] => [000010, 000101] => 000101 000010 => 322
function simpleHash(deck: number[]): number {
    const maxNumberBits = 6 // 2^6 = 64 = max allowed card number
    let offset = 0
    let hash = 0
    for (let card of deck) {
        // Native bitwise operations convert anything to 32bit integer and didnt work: https://stackoverflow.com/questions/337355/javascript-bitwise-shift-of-long-long-number
        // hash |= card << offset
        hash += card * Math.pow(2, offset)
        offset += maxNumberBits
    }
    return hash
}

function star1() {
    const decks = getInputDecks()
    while (decks[0].length > 0 && decks[1].length > 0) {
        // console.log('decks', decks[0], decks[1])
        const c1 = decks[0].pop() ?? -1
        const c2 = decks[1].pop() ?? -1
        if (c1 > c2) {
            decks[0].unshift(c1)
            decks[0].unshift(c2)
        } else {
            decks[1].unshift(c2)
            decks[1].unshift(c1)
        }
    }
    return countPoints(decks.find(deck => deck.length > 0) ?? [])
}

function star2() {
    interface Result {
        p1won: boolean,
        score: number
    }

    function playSubgame(deck1: number[], deck2: number[], previousHands: number[]): Result {
        // console.log('decks', deck1.reverse(), deck2.reverse()); deck1.reverse(); deck2.reverse();
        if (deck2.length < 1) return { p1won: true, score: countPoints(deck1) }
        if (deck1.length < 1) return { p1won: false, score: countPoints(deck2) }
        const deck1hash = simpleHash(deck1) // 20x faster than comparing deck1.toString()
        if (previousHands.find(it => it != 0 && it == deck1hash)) {
            return { p1won: true, score: countPoints(deck1) }
        }
        previousHands.push(deck1hash)

        const c1 = deck1.pop() ?? -1
        const c2 = deck2.pop() ?? -1
        let p1wins: boolean
        if (c1 <= deck1.length && c2 <= deck2.length) {
            // the quantity of cards copied is equal to the number on the card they drew to trigger the sub-game !!!
            p1wins = playSubgame(deck1.slice(deck1.length - c1), deck2.slice(deck2.length - c2), []).p1won
        } else {
            p1wins = c1 > c2
        }
        if (p1wins) {
            deck1.unshift(c1)
            deck1.unshift(c2)
            return playSubgame(deck1, deck2, previousHands)
        } else {
            deck2.unshift(c2)
            deck2.unshift(c1)
            return playSubgame(deck1, deck2, previousHands)
        }
    }

    const decks = getInputDecks()
    return playSubgame(decks[0], decks[1], []).score
}



