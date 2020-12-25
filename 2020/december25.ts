
/**
 * https://adventofcode.com/2020/day/25
 */
const inputCard = 6930903
const inputDoor = 19716708

console.log(star1()); // 10548634

function transform(subjectNumber: number, loopSize: number) {
    let value = 1
    for (let i = 0; i < loopSize; i++) {
        value *= subjectNumber
        value = value % 20201227
    }
    return value
}

function getLoopSize(subjectNumber: number, publicKey: number) {
    let value = 1
    let loopSize = 0
    while (value != publicKey) {
        value *= subjectNumber
        value = value % 20201227
        loopSize++
    }
    return loopSize
}

function star1(): number {
    const cardLoops = getLoopSize(7, inputCard) // 10548634
    const doorLoops = getLoopSize(7, inputDoor)
    const result1 = transform(inputDoor, cardLoops)
    const result2 = transform(inputCard, doorLoops)
    if (result1 !== result2) throw Error('Keys not the same ' +  result1 + ' ' + result2)
    return result1
}




