/**
 * https://adventofcode.com/2020/day/23
 */
const input = '538914762'

console.time('star1')
console.log(star1()) // 54327968
console.timeEnd('star1')

console.time('star2 (linked list)')
console.log(star2()) // 157410423276
console.timeEnd('star2 (linked list)')

// array implementation (too slow for part 2 even if optimized in a loop over single array)
function playNextMove(cups: number[], turnsLeft: number): number[] {
    if (turnsLeft == 0) {
        return cups
    }
    const current = cups[0]
    const pickUp = cups.slice(1, 4)
    const remainingCups = cups.slice(4, cups.length + 1)

    let destination = (current + cups.length - 2) % cups.length + 1
    let idx = -1
    while ((idx = remainingCups.indexOf(destination)) == -1) {
        destination = (destination + cups.length - 2) % cups.length + 1
    }
    const remainingBeforeDest = remainingCups.slice(0, idx)
    const remainingAfterDest = remainingCups.slice(idx + 1)
    return playNextMove(remainingBeforeDest.concat(destination).concat(pickUp).concat(remainingAfterDest).concat(current), turnsLeft - 1)
}

function star1(): string {
    const inputCups = input.split('').map(it => Number.parseInt(it))
    const result = playNextMove(inputCups, 100).join('')
    return result.substring(result.indexOf('1') + 1) + result.substring(0, result.indexOf('1'))
}

// linked list implementation
function star2() {
    // lay out input cups
    const inputCups = input.split('').map(it => Number.parseInt(it))
    let highestCup = inputCups.reduce((acc, c) => acc > c ? acc : c)
    const cupsInCircle = 1000000
    for (let i = highestCup + 1; i <= cupsInCircle; i++) {
        inputCups.push(i)
    }

    // create a linked list
    const nextCup: number[] = []
    for (let i = 0; i < inputCups.length; i++) {
        const currentCup = inputCups[i]
        nextCup[currentCup] = inputCups[(i + 1) % cupsInCircle]
    }

    // play moves
    const movesToPlay = 10000000
    let current = inputCups[0]
    for (let i = 0; i < movesToPlay; i++) {
        let pickUp1 = nextCup[current]
        let pickUp2 = nextCup[pickUp1]
        let pickUp3 = nextCup[pickUp2]
        let destination = current
        do {
            destination = (destination - 2 + cupsInCircle) % cupsInCircle + 1
        } while (pickUp1 == destination || pickUp2 == destination || pickUp3 == destination)

        // remove 3 picked up cups from current list
        nextCup[current] = nextCup[pickUp3]

        // insert 3 picked up cups after destination
        nextCup[pickUp3] = nextCup[destination]
        nextCup[destination] = pickUp1

        // move to next cup
        current = nextCup[current]
    }
    return nextCup[1] * nextCup[nextCup[1]]
}



