import { readFileSync } from 'fs';


const input = readFileSync('./december12.txt', 'utf-8');

console.log(star1());
console.log(star2());


function star1() {
    const lines = input.split(/\r?\n/);
    let angle = 0;
    let east = 0;
    let north = 0;
    for (let line of lines) {
        const value = Number.parseInt(line.substr(1, line.length));
        if (isNaN(value)) {
            continue;
        }
        if (line.startsWith('N')) {
            north += value;
        } else if (line.startsWith('S')) {
            north -= value;
        } else if (line.startsWith('E')) {
            east += value;
        } else if (line.startsWith('W')) {
            east -= value;
        } else if (line.startsWith('L')) {
            angle = (angle + value) % 360;
        } else if (line.startsWith('R')) {
            angle = (angle - value + 360) % 360;
        } else if (line.startsWith('F')) {
            if (angle == 0) {
                east += value;
            } else if (angle == 90) {
                north += value;
            } else if (angle == 180) {
                east -= value;
            } else if (angle == 270) {
                north -= value;
            }
        }
    }
    return Math.abs(north) + Math.abs(east);
}

function star2() {
    const lines = input.split(/\r?\n/);
    let east = 0;
    let north = 0;
    let waypointEast = 10;
    let waypointNorth = 1;
    for (let line of lines) {
        const value = Number.parseInt(line.substr(1, line.length));
        if (isNaN(value)) {
            continue;
        }
        if (line.startsWith('N')) {
            waypointNorth += value;
        } else if (line.startsWith('S')) {
            waypointNorth -= value;
        } else if (line.startsWith('E')) {
            waypointEast += value;
        } else if (line.startsWith('W')) {
            waypointEast -= value;
        } else if (line.startsWith('L')) {
            for (let i = 0; i < value / 90; i++) {
                // rotate 90 degrees counter clockwise
                if (waypointNorth >= 0 && waypointEast >= 0) { // quadrant I
                    const tmp = -waypointNorth;
                    waypointNorth = waypointEast;
                    waypointEast = tmp;
                } else if (waypointNorth >= 0 && waypointEast < 0) { // quadrant II
                    const tmp = -waypointNorth;
                    waypointNorth = waypointEast;
                    waypointEast = tmp;
                } else if (waypointNorth < 0 && waypointEast < 0) { // quadrant III
                    const tmp = -waypointNorth;
                    waypointNorth = waypointEast;
                    waypointEast = tmp;
                } else if (waypointNorth < 0 && waypointEast >= 0) { // quadrant IV
                    const tmp = -waypointNorth;
                    waypointNorth = waypointEast;
                    waypointEast = tmp;
                }
            }
        } else if (line.startsWith('R')) {
            for (let i = 0; i < (360 - value) / 90; i++) {
                // rotate 90 degrees counter clockwise
                if (waypointNorth >= 0 && waypointEast >= 0) { // quadrant I
                    const tmp = -waypointNorth;
                    waypointNorth = waypointEast;
                    waypointEast = tmp;
                } else if (waypointNorth >= 0 && waypointEast < 0) { // quadrant II
                    const tmp = -waypointNorth;
                    waypointNorth = waypointEast;
                    waypointEast = tmp;
                } else if (waypointNorth < 0 && waypointEast < 0) { // quadrant III
                    const tmp = -waypointNorth;
                    waypointNorth = waypointEast;
                    waypointEast = tmp;
                } else if (waypointNorth < 0 && waypointEast >= 0) { // quadrant IV
                    const tmp = -waypointNorth;
                    waypointNorth = waypointEast;
                    waypointEast = tmp;
                }
            }
        } else if (line.startsWith('F')) {
            east += waypointEast * value;
            north += waypointNorth * value;
        }
    }
    // console.log('north:' + north + ' east: ' + east);
    return Math.abs(north) + Math.abs(east);
}


