import {readFileSync} from 'fs';

/**
 * https://adventofcode.com/2020/day/24
 */
const input = readFileSync('./december24.txt', 'utf-8');

console.log(star1()); // 500
console.log(star2()); // 4280


// tile coordinate system
//    /\
//    / northEast
//   /
//  /
// /_____east____>
interface Tile {
    east: number,
    northEast: number,
}

function tileEquals(t1: Tile, t2: Tile) {
    return t1.east == t2.east && t1.northEast == t2.northEast
}

function getTile(line: string): Tile {
    const tile: Tile = {
        east: 0,
        northEast: 0
    }
    for (const direction of (line.match(/[ns]?[ew]/g) || [])) {
        switch (direction) {
            case 'ne':
                tile.northEast++
                break
            case 'e':
                tile.east++
                break
            case 'se':
                tile.east++
                tile.northEast--
                break
            case 'sw':
                tile.northEast--
                break
            case 'w':
                tile.east--
                break
            case 'nw':
                tile.east--
                tile.northEast++
                break
            default:
                throw Error('Could not parse direction "' + direction + '"')
        }
    }
    return tile
}

function getBlackTiles(): Tile[] {
    return input
        .split(/\r?\n/)
        .filter(line => line != '')
        .map(line => getTile(line))
        // .sort((t1, t2) => t1.northEast > t2.northEast ? -1 : 1)
        // group together flipped same tiles
        .reduce((acc, tile) => {
            if (acc.find(it => tileEquals(it, tile))) {
                return acc.filter(it => !tileEquals(it, tile))
            } else {
                return acc.concat(tile)
            }
        }, [] as Tile[])
}

function star1() {
    return getBlackTiles().length
}

function star2() {
    return flipTiles(getBlackTiles(), 100).length
}

function flipTiles(blackTiles: Tile[], turnsLeft: number): Tile[] {
    if (turnsLeft == 0) return blackTiles
    const furthestNortheast = blackTiles.reduce((acc, tile) => Math.max(tile.northEast, acc), 0)
    const furthestEast = blackTiles.reduce((acc, tile) => Math.max(tile.east, acc), 0)
    const furthestSouthwest = blackTiles.reduce((acc, tile) => Math.min(tile.northEast, acc), 0)
    const furthestWest = blackTiles.reduce((acc, tile) => Math.min(tile.east, acc), 0)
    const blackTilesAfter: Tile[] = []
    for (let east = furthestWest - 1; east <= furthestEast + 1; east++) {
        for (let northEast = furthestSouthwest - 1; northEast <= furthestNortheast + 1; northEast++) {
            const tile: Tile = {east, northEast}
            const blackAdjecent = blackTiles.filter(it =>
                // coordinates of 6 surrounding tiles
                (it.east == tile.east - 1 && it.northEast == tile.northEast    ) ||
                (it.east == tile.east - 1 && it.northEast == tile.northEast + 1) ||
                (it.east == tile.east     && it.northEast == tile.northEast - 1) ||
                (it.east == tile.east     && it.northEast == tile.northEast + 1) ||
                (it.east == tile.east + 1 && it.northEast == tile.northEast    ) ||
                (it.east == tile.east + 1 && it.northEast == tile.northEast - 1)
            ).length
            if (blackTiles.find(it => tileEquals(it, tile))) {
                if (blackAdjecent == 1 || blackAdjecent == 2) {
                    // Any black tile with zero or more than 2 black tiles immediately adjacent to it is flipped to white.
                    blackTilesAfter.push(tile)
                }
            } else if (blackAdjecent == 2) {
                // Any white tile with exactly 2 black tiles immediately adjacent to it is flipped to black.
                blackTilesAfter.push(tile)
            }
        }
    }
    return flipTiles(blackTilesAfter, turnsLeft - 1)
}



