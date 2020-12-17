import {readFileSync} from 'fs';

/**
 * https://adventofcode.com/2020/day/17
 */
const input = readFileSync('./december17.txt', 'utf-8');

console.log(star1()); // 295
console.log(star2()); // 1972

function star1() {
    interface Point {
        x: number,
        y: number,
        z: number
    }

    interface Space {
        lowest: Point
        highest: Point
    }

    function getNextPointVolume(currentPoints: Point[]): Space {
        return {
            lowest: {
                x: Math.min.apply(Math, currentPoints.map(p => p.x)) - 1,
                y: Math.min.apply(Math, currentPoints.map(p => p.y)) - 1,
                z: Math.min.apply(Math, currentPoints.map(p => p.z)) - 1
            },
            highest: {
                x: Math.max.apply(Math, currentPoints.map(p => p.x)) + 1,
                y: Math.max.apply(Math, currentPoints.map(p => p.y)) + 1,
                z: Math.max.apply(Math, currentPoints.map(p => p.z)) + 1
            }
        }

    }

    function activeCount(pointsIn: Point[], stepsLeft: number): number {
        if (stepsLeft == 0) {
            return pointsIn.length
        }

        const volumeToCheck = getNextPointVolume(pointsIn)
        const pointsOut: Point[] = [];
        for (let x = volumeToCheck.lowest.x; x <= volumeToCheck.highest.x; x++){
            for (let y = volumeToCheck.lowest.y; y <= volumeToCheck.highest.y; y++){
                for (let z = volumeToCheck.lowest.z; z <= volumeToCheck.highest.z; z++){
                    const selfActive = pointsIn.find(p => p.x == x && p.y == y && p.z == z) ? 1 : 0
                    const activeNeighbours = pointsIn.filter(p =>
                        p.x >= x - 1 && p.x <= x + 1 && p.y >= y - 1 && p.y <= y + 1 && p.z >= z - 1 && p.z <= z + 1
                    ).length - selfActive

                    // If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
                    // If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.
                    if (activeNeighbours == 3 || activeNeighbours == 2 && selfActive) {
                        pointsOut.push({x, y, z})
                    }
                }
            }
        }

        return activeCount(pointsOut, stepsLeft - 1)
    }


    const points: Point[] = [];
    input.split(/\r\n/)
        .filter(row => row != '')
        .forEach((row, x) =>
            row.split('').forEach((point, y) => {
                if (point == '#') points.push({x, y, z: 0})
            }))

    return activeCount(points, 6)
}

function star2() {
    interface Point {
        x: number,
        y: number,
        z: number,
        w: number
    }

    interface Space {
        lowest: Point
        highest: Point
    }

    function getNextPointVolume(currentPoints: Point[]): Space {
        return {
            lowest: {
                x: Math.min.apply(Math, currentPoints.map(p => p.x)) - 1,
                y: Math.min.apply(Math, currentPoints.map(p => p.y)) - 1,
                z: Math.min.apply(Math, currentPoints.map(p => p.z)) - 1,
                w: Math.min.apply(Math, currentPoints.map(p => p.w)) - 1
            },
            highest: {
                x: Math.max.apply(Math, currentPoints.map(p => p.x)) + 1,
                y: Math.max.apply(Math, currentPoints.map(p => p.y)) + 1,
                z: Math.max.apply(Math, currentPoints.map(p => p.z)) + 1,
                w: Math.max.apply(Math, currentPoints.map(p => p.w)) + 1
            }
        }

    }

    function activeCount(pointsIn: Point[], stepsLeft: number): number {
        if (stepsLeft == 0) {
            return pointsIn.length
        }

        const volumeToCheck = getNextPointVolume(pointsIn)
        const pointsOut: Point[] = [];
        for (let x = volumeToCheck.lowest.x; x <= volumeToCheck.highest.x; x++){
            for (let y = volumeToCheck.lowest.y; y <= volumeToCheck.highest.y; y++){
                for (let z = volumeToCheck.lowest.z; z <= volumeToCheck.highest.z; z++){
                    for (let w = volumeToCheck.lowest.w; w <= volumeToCheck.highest.w; w++) {
                        const selfActive = pointsIn.find(p => p.x == x && p.y == y && p.z == z && p.w == w) ? 1 : 0
                        const activeNeighbours = pointsIn.filter(p =>
                            p.x >= x - 1 && p.x <= x + 1 &&
                            p.y >= y - 1 && p.y <= y + 1 &&
                            p.z >= z - 1 && p.z <= z + 1 &&
                            p.w >= w - 1 && p.w <= w + 1
                        ).length - selfActive

                        // If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
                        // If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.
                        if (activeNeighbours == 3 || activeNeighbours == 2 && selfActive) {
                            pointsOut.push({x, y, z, w})
                        }
                    }
                }
            }
        }
        return activeCount(pointsOut, stepsLeft - 1)
    }

    const points: Point[] = [];
    input.split(/\r\n/)
        .filter(row => row != '')
        .forEach((row, x) =>
            row.split('').forEach((point, y) => {
                if (point == '#') points.push({x, y, z: 0, w: 0})
            }))

    return activeCount(points, 6)
}



