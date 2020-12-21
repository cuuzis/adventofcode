import {readFileSync} from 'fs';

/**
 * https://adventofcode.com/2020/day/20
 */
const input = readFileSync('./december20.txt', 'utf-8');

console.log(star1()); // 22878471088273
console.log(star2()); // 1680


interface Tile {
    id: number
    // string representation of edges
    top: string
    bottom: string
    left: string
    right: string
    // tile image for part 2
    content: string[]
}

function rotateImageClockwise90(image: string[]): string[] {
    const result = image.map(() => '')
    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result.length; j++) {
            result[i] += image[result.length - 1 - j].charAt(i)
        }
    }
    return result;
}

function rotateClockwise90(tile: Tile): Tile {
    return {
        id: tile.id,
        top: tile.left.split('').reverse().join(''),
        right: tile.top,
        bottom: tile.right.split('').reverse().join(''),
        left: tile.bottom,
        content: rotateImageClockwise90(tile.content)
    }
}

function flipVertically(tile: Tile): Tile {
    return {
        id: tile.id,
        top: tile.bottom,
        right: tile.right.split('').reverse().join(''),
        bottom: tile.top,
        left: tile.left.split('').reverse().join(''),
        content: tile.content.reverse()
    }
}

function solvePuzzle() {
    function buildPuzzle(idx: number, placedTiles: Tile[], remainingTiles: Tile[]): Tile[] {
        if (remainingTiles.length == 0) return placedTiles
        for (const tile of remainingTiles) {
            let fits = true
            if (idx > puzzleHeight - 1) {
                // validate top fit for every piece except first row
                fits = tile.top == placedTiles[idx - puzzleHeight].bottom
            }
            if (idx % puzzleHeight != 0) {
                // validate left fit for every piece except first column
                fits = fits && tile.left == placedTiles[idx - 1].right
            }
            if (fits) {
                const result = buildPuzzle(idx + 1, [...placedTiles].concat(tile), remainingTiles.filter(it => it.id != tile.id))
                if (result.length > 0) {
                    return result
                }
            }
        }
        return []
    }

    const parts = input
        .split(/\r?\n\r?\n/)
    const possibleTiles = parts
        // read edges
        .map(tileStr => {
            let tiles: Tile[] = []
            const id = Number.parseInt(tileStr.match(/\d+/)?.toString() ?? '-1')
            const top = tileStr.split(/\r?\n/)[1]
            const bottom = tileStr.split(/\r?\n/)[10]
            const left = (tileStr.match(/^[.#]/gm) ?? []).join('')
            const right = (tileStr.match(/[.#]$/gm) ?? []).join('')
            const content = tileStr.split(/\r?\n/).slice(2, 10).map(it => it.substring(1, 9))
            // add 4 rotations
            let tile = { id, top, bottom, left, right, content } as Tile
            for (let i = 0; i < 4; i++) {
                tiles.push(tile);
                tile = rotateClockwise90(tile)
            }
            // add 4 rotations of flipped tile
            tile = flipVertically(tile)
            for (let i = 0; i < 4; i++) {
                tiles.push(tile);
                tile = rotateClockwise90(tile)
            }
            return tiles
        })
        // flatMap
        .reduce((acc, x) => acc.concat(...x), [])

    const puzzleHeight = Math.sqrt(parts.length)
    const puzzle = buildPuzzle(0, [], possibleTiles)
    return {puzzle, puzzleHeight}
}


function star1() {
    const result = solvePuzzle()
    const puzzle = result.puzzle
    const puzzleHeight = result.puzzleHeight
    return puzzle[0].id * puzzle[puzzleHeight - 1].id * puzzle[puzzleHeight * puzzleHeight - puzzleHeight].id * puzzle[puzzleHeight * puzzleHeight - 1].id
}

function star2() {
    function solutionAsImage(): string[] {
        const solution = solvePuzzle()
        const solutionImage: string[] = []
        for (let i = 0; i < solution.puzzleHeight; i++) {
            for (let k = 0; k < 8; k++) {
                let line = ''
                for (let j = 0; j < solution.puzzleHeight; j++) {
                    line += solution.puzzle[i * solution.puzzleHeight + j].content[k]
                }
                solutionImage.push(line)
            }
        }
        return solutionImage
    }

    function countSeaMonsters(img: string[]): number {
        let monsters = 0
        for (let i = 0; i < img.length - 2; i++) {
            // sea monster:
            //                   #   // re3
            // #    ##    ##    ###  // re2
            //  #  #  #  #  #  #     // re1
            // comparison is for an upside down monster, to have fewer loops matching the head
            // regex always consumes 1 char and rest of sea monster is in lookahead part
            const re3 = /[.#]{1}(?=[.#]{17}#)/g
            const re2 = /[#]{1}(?=.{4}##.{4}##.{4}###)/g
            const re1 = /[.#]{1}(?=#.{2}#.{2}#.{2}#.{2}#.{2}#)/g

            let match1 = null
            while (match1 = re1.exec(img[i])) {
                let match2 = null
                while (match2 = re2.exec(img[i + 1])) {
                    if (match1.index == match2.index) {
                        let match3 = null
                        while (match3 = re3.exec(img[i + 2])) {
                            if (match2.index == match3.index) {
                                monsters++
                            }
                        }
                    }
                }
            }
        }
        return monsters
    }


    const imagesToTest = [];
    let image = solutionAsImage()
    // add 4 rotations
    for (let i = 0; i < 4; i++) {
        imagesToTest.push(image);
        image = rotateImageClockwise90(image)
    }
    // add 4 rotations of vertically flipped image
    image = image.reverse()
    for (let i = 0; i < 4; i++) {
        imagesToTest.push(image);
        image = rotateImageClockwise90(image)
    }
    // return imagesToTest

    for (let testImage of imagesToTest) {
        const seaMonsters = countSeaMonsters(testImage)
        if (seaMonsters > 0) {
            // console.log(testImage)
            // presuming sea monsters do not overlap and always take up 15 '#'
            return (testImage.join().match(/[#]/g) ?? []).length - seaMonsters * 15
        }
    }
    return -1
}



