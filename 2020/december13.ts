import { readFileSync } from 'fs';

/**
 * https://adventofcode.com/2020/day/13
 */
const input = readFileSync('./december13.txt', 'utf-8');

console.log(star1()); // 92
console.log(star2()); // 867295486378319


function star1() {
    const lines = input.split(/\r?\n/);
    const earliestDeparture = Number.parseInt(lines[0]);
    const buses = lines[1]
        .split(',')
        .filter(it => it !== 'x')
        .map(it => Number.parseInt(it));
    let leastWaitingMinutes = null;
    let leastWaitingBus = null;
    for (const bus of buses) {
        const minutesToWait = bus - earliestDeparture % bus;
        if (leastWaitingMinutes == null || minutesToWait < leastWaitingMinutes) {
            leastWaitingMinutes = minutesToWait;
            leastWaitingBus = bus;
        }
    }
    if (leastWaitingBus == null || leastWaitingMinutes == null) return -1
    return leastWaitingBus * leastWaitingMinutes;
}

// optimized, knowing that all bus numbers are already primes
function star2() {
    const lines = input.split(/\r?\n/);
    const buses = lines[1]
        .split(',')
        .map((bus, idx) => ({id: Number.parseInt(bus), firstDeparture: idx}))
        .filter(it => !isNaN(it.id));
    console.log(buses);

    let t = 0;
    let step = 1;
    let depth = 0;
    while (depth < buses.length) {
        t += step;
        if ((t + buses[depth].firstDeparture) % buses[depth].id == 0) {
            step *= buses[depth].id;
            depth++;
        }
    }
    return t;
}

// naive implementation, works for small numbers
function star2_bruteForce() {
    const lines = input.split(/\r?\n/);
    const buses = lines[1]
        .split(',')
        .map((bus, idx) => ({id: Number.parseInt(bus), firstDeparture: idx}))
        .filter(it => !isNaN(it.id));
    // console.log(buses);

    for (let i = 1; i < Number.MAX_SAFE_INTEGER / (buses[0].id + buses[buses.length-1].id); i++) {
        const t = i * buses[0].id;
        if (i % 10000000 == 0) console.log('processing i=' + i);
        for (let j = 1; j < buses.length; j++) {
            const bus = buses[j];
            if ((bus.firstDeparture + t) % bus.id != 0) {
                break;
            } else if (j + 1 == buses.length) {
                return i * buses[0].id;
            }
        }
    }
}


