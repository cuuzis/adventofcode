import { readFileSync } from 'fs';

/**
 * https://adventofcode.com/2021/day/16
 */
const input = readFileSync('./december16.txt', 'utf-8');

const hexToBinary: {[key: string]: string} = {
    '0': '0000',
    '1': '0001',
    '2': '0010',
    '3': '0011',
    '4': '0100',
    '5': '0101',
    '6': '0110',
    '7': '0111',
    '8': '1000',
    '9': '1001',
    'A': '1010',
    'B': '1011',
    'C': '1100',
    'D': '1101',
    'E': '1110',
    'F': '1111',
};


console.log('star 1:');
console.log(star1());
console.log('star 2:');
console.log(star2());



function star1() {

    function readNextBitsAsNumber(numberOfBits: number) {
        let result = 0;
        for (let i = 0; i < numberOfBits; i++) {
            result |= bitStream.pop()! << (numberOfBits - 1 - i);
        }
        return result
    }

    function readPacket(): {valueSum: number, bitsConsumed: number} {
        const version = readNextBitsAsNumber(3);
        let result = { valueSum: version, bitsConsumed: 0} ;
        const packetType = readNextBitsAsNumber(3); result.bitsConsumed+=3;
        // console.log({bitStream})
        if (packetType === 4) {
            // literal value
            const numbersInStream = [];
            let prefixBit = readNextBitsAsNumber(1);result.bitsConsumed+=1;
            while (prefixBit === 1) {
                for (let i = 0; i < 4; i++) {
                    numbersInStream.push(bitStream.pop());result.bitsConsumed+=1;
                }
                prefixBit = readNextBitsAsNumber(1);result.bitsConsumed+=1;
                // console.log({prefixBit, numbersInStream})
            }
            for (let i = 0; i < 4; i++) {
                numbersInStream.push(bitStream.pop());result.bitsConsumed+=1;
            }
            // result.values += numbersInStream
            //     .reverse()
            //     .reduce((acc, currentValue, idx) => acc! |= (currentValue! << idx), 0) ?? -1
        } else {
            const lengthTypeId = readNextBitsAsNumber(1);result.bitsConsumed+=1;
            if (lengthTypeId === 0) {
                let totalLengthInBits = readNextBitsAsNumber(15);result.bitsConsumed+=15;
                while (totalLengthInBits > 0) {
                    let {valueSum, bitsConsumed} = readPacket();
                    totalLengthInBits -= bitsConsumed;
                    result.valueSum += valueSum;
                }
            } else {
                const totalSubPackets = readNextBitsAsNumber(11);result.bitsConsumed+=11;
                for (let i = 0; i < totalSubPackets; i++) {
                    result.valueSum += readPacket().valueSum;
                }
            }
        }
        return result;
    }

    const bitStream = input
        .split(/\r?\n\r?\n?/)[0]
        .split('')
        .map(char => hexToBinary[char])
        .join('')
        .split('')
        .map(Number)
        .reverse();

    return readPacket().valueSum;
}

// did not take into account integer overflow
function star2() {

    function readNextBitsAsNumber(numberOfBits: number) {
        let result = 0;
        for (let i = 0; i < numberOfBits; i++) {
            result |= bitStream.pop()! << (numberOfBits - 1 - i);
        }
        return result
    }

    function readPacket(): bigint {
        const version = readNextBitsAsNumber(3);
        const packetType = readNextBitsAsNumber(3);
        const subPackets: bigint[] = [];
        if (packetType === 4) {
            // literal value
            const numbersInStream = [];
            let prefixBit = readNextBitsAsNumber(1);
            while (prefixBit === 1) {
                for (let i = 0; i < 4; i++) {
                    numbersInStream.push(bitStream.pop());
                }
                prefixBit = readNextBitsAsNumber(1);
            }
            for (let i = 0; i < 4; i++) {
                numbersInStream.push(bitStream.pop());
            }
            const literalValue = numbersInStream
                .reverse()
                .reduce((acc, currentValue, idx) => acc! |= (BigInt(currentValue!) << BigInt(idx)), BigInt(0))
            if (!literalValue || literalValue < 0) {
                throw new Error('Literal value wrong: ' + literalValue)
            }
            return literalValue;
        } else {
            const lengthTypeId = readNextBitsAsNumber(1);
            if (lengthTypeId === 0) {
                let totalLengthInBits = readNextBitsAsNumber(15);
                const expectedLengthAfterReadingPacket = bitStream.length - totalLengthInBits;
                while (bitStream.length > expectedLengthAfterReadingPacket) {
                    subPackets.push(readPacket());
                }
            } else {
                const totalSubPackets = readNextBitsAsNumber(11);
                for (let i = 0; i < totalSubPackets; i++) {
                    subPackets.push(readPacket());
                }
            }
        }
        if (subPackets.length === 1) {
            return subPackets[0];
        } else if (subPackets.length > 1) {
            switch (packetType) {
                case 0: // sum
                    return subPackets.reduce((acc, currentValue) => acc + currentValue);
                case 1: // product
                    return subPackets.reduce((acc, currentValue) => acc * currentValue);
                case 2: // min
                    return subPackets.reduce((acc, currentValue) => acc < currentValue ? acc : currentValue);
                case 3: // max
                    return subPackets.reduce((acc, currentValue) => acc > currentValue ? acc : currentValue);
                case 5:
                    if (subPackets.length !== 2) throw new Error('case 5: ' + subPackets);
                    return subPackets.reduce((acc, currentValue) => acc > currentValue ? BigInt(1) : BigInt(0));
                case 6:
                    if (subPackets.length !== 2) throw new Error('case 6: ' + subPackets);
                    return subPackets.reduce((acc, currentValue) => acc < currentValue ? BigInt(1) : BigInt(0));
                case 7:
                    if (subPackets.length !== 2) throw new Error('case 7: ' + subPackets);
                    return subPackets.reduce((acc, currentValue) => acc === currentValue ? BigInt(1) : BigInt(0));
                default:
                    throw new Error(`Unexpected packetType: ${packetType}`);
            }
        }
        throw new Error('Unexpected packet without subpackets: ' + {bitStream})
    }

    let bitStream = input
        .split(/\r?\n\r?\n?/)[0]
        .split('')
        .map(char => hexToBinary[char])
        .join('')
        .split('')
        .map(Number)
        .reverse();

    return Number(readPacket());
}

// function star2() {
//
//     function readNextBitsAsNumber(numberOfBits: number) {
//         let result = 0;
//         for (let i = 0; i < numberOfBits; i++) {
//             result |= bitStream.pop()! << (numberOfBits - 1 - i);
//         }
//         return result
//     }
//
//     function readPacket(): number {
//         const version = readNextBitsAsNumber(3);
//         const packetType = readNextBitsAsNumber(3);
//         const subPackets: number[] = [];
//         if (packetType === 4) {
//             // literal value
//             const numbersInStream = [];
//             let prefixBit = readNextBitsAsNumber(1);
//             while (prefixBit === 1) {
//                 for (let i = 0; i < 4; i++) {
//                     numbersInStream.push(bitStream.pop());
//                 }
//                 prefixBit = readNextBitsAsNumber(1);
//             }
//             for (let i = 0; i < 4; i++) {
//                 numbersInStream.push(bitStream.pop());
//             }
//             const literalValue = numbersInStream
//                 .reverse()
//                 .reduce((acc, currentValue, idx) => acc! |= (currentValue! << idx), 0)
//             if (!literalValue) {
//                 throw new Error('Literal value wrong: ' + literalValue)
//             }
//             return literalValue;
//         } else {
//             const lengthTypeId = readNextBitsAsNumber(1);
//             if (lengthTypeId === 0) {
//                 let totalLengthInBits = readNextBitsAsNumber(15);
//                 const expectedLengthAfterReadingPacket = bitStream.length - totalLengthInBits;
//                 while (bitStream.length > expectedLengthAfterReadingPacket) {
//                     subPackets.push(readPacket());
//                 }
//             } else {
//                 const totalSubPackets = readNextBitsAsNumber(11);
//                 for (let i = 0; i < totalSubPackets; i++) {
//                     subPackets.push(readPacket());
//                 }
//             }
//         }
//         if (subPackets.length === 1) {
//             return subPackets[0];
//         } else if (subPackets.length > 1) {
//             switch (packetType) {
//                 case 0:
//                     return subPackets.reduce((acc, currentValue) => acc + currentValue);
//                 case 1:
//                     return subPackets.reduce((acc, currentValue) => acc * currentValue);
//                 case 2:
//                     return subPackets.reduce((acc, currentValue) => Math.min(acc, currentValue));
//                 case 3:
//                     return subPackets.reduce((acc, currentValue) => Math.max(acc, currentValue));
//                 case 5:
//                     if (subPackets.length !== 2) throw new Error('case 5: ' + subPackets);
//                     return subPackets.reduce((acc, currentValue) => acc > currentValue ? 1 : 0);
//                 case 6:
//                     if (subPackets.length !== 2) throw new Error('case 6: ' + subPackets);
//                     return subPackets.reduce((acc, currentValue) => acc < currentValue ? 1 : 0);
//                 case 7:
//                     if (subPackets.length !== 2) throw new Error('case 7: ' + subPackets);
//                     return subPackets.reduce((acc, currentValue) => acc === currentValue ? 1 : 0);
//                 default:
//                     throw new Error(`Unexpected packetType: ${packetType}`);
//             }
//         }
//         throw new Error('Unexpected packet without subpackets: ' + {bitStream})
//     }
//
//     let bitStream = input
//         .split(/\r?\n\r?\n?/)[0]
//         .split('')
//         .map(char => hexToBinary[char])
//         .join('')
//         .split('')
//         .map(Number)
//         .reverse();
//
//     return readPacket();
// }
