// to run:
// 1. open december11.txt or https://adventofcode.com/2020/day/11/input in browser
// 2. paste code in console


console.log(star1()); // 2494
console.log(star2()); // 2306

function star1() {
	const input = document.body.textContent.split('\n');
	const seatsBefore = [ ...input ].map(it => it.split(''));
	return shuffle1(seatsBefore)
	// count '#'
	.flat()
	.reduce((acc, value) => value === '#' ? acc + 1 : acc, 0);
}

function star2() {
	const input = document.body.textContent.split('\n');
	const seatsBefore = [ ...input ].map(it => it.split(''));
	return shuffle2(seatsBefore)
	// count '#'
	.flat()
	.reduce((acc, value) => value === '#' ? acc + 1 : acc, 0);
}

function shuffle1(seatsBefore) {
	// 2 level deep clone
	const seatsAfter = [ ...seatsBefore ].map(it => [ ...it ]);
	let hasChanged = false;
	for (let row = 0; row < seatsBefore.length; row++) {
		for (let col = 0; col < seatsBefore[row].length; col++) {
			const seat = seatsBefore[row][col];
			if (seat === 'L') {
				if (countAdjecent(row, col, '#', seatsBefore) === 0) {
					hasChanged = true;
					seatsAfter[row][col] = '#';
				}
			} else if (seat === '#') {
				if (countAdjecent(row, col, '#', seatsBefore) >= 4) {
					hasChanged = true;
					seatsAfter[row][col] = 'L';
				}
			}
		}
	}
	// console.log(seatsAfter.join('\n').replaceAll(',', ''));
	if (hasChanged) {
		return shuffle1(seatsAfter);
	}
	return seatsAfter;
}

function countAdjecent(testRow, testCol, mark, seats) {
	let count = 0;
	for (let row = testRow - 1; row <= testRow + 1; row++) {
		if (row >= 0 && row < seats.length) {
			for (let col = testCol - 1; col <= testCol + 1; col++) {
				if (col >= 0 && col < seats[0].length && !(row === testRow && col === testCol)) {
					const seat = seats[row][col];
					if (seat === mark) {
						// console.log('seats[' + row + '][' + col + ']=' + mark);
						count++;
					}
				}
			}
		}
	}
	// console.log('countAdjecent[' + testRow + '][' + testCol + ']=' + count);
	return count;
}

function shuffle2(seatsBefore) {
	// 2 level deep clone
	const seatsAfter = [ ...seatsBefore ].map(it => [ ...it ]);
	let hasChanged = false;
	for (let row = 0; row < seatsBefore.length; row++) {
		for (let col = 0; col < seatsBefore[row].length; col++) {
			const seat = seatsBefore[row][col];
			if (seat === 'L') {
				if (countDirectional(row, col, '#', seatsBefore) === 0) {
					hasChanged = true;
					seatsAfter[row][col] = '#';
				}
			} else if (seat === '#') {
				if (countDirectional(row, col, '#', seatsBefore) >= 5) {
					hasChanged = true;
					seatsAfter[row][col] = 'L';
				}
			}
		}
	}
	// console.log(seatsAfter.join('\n').replaceAll(',', ''));
	if (hasChanged) {
		return shuffle2(seatsAfter);
	}
	return seatsAfter;
}

function countDirectional(testRow, testCol, mark, seats) {
	let count = 0;
	// 8 directions and staying still (i==0 && j==0)
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			count += countDirection(i, j, testRow, testCol, mark, seats);
		}
	}
	return count;
}

function countDirection(offsetRow, offsetCol, testRow, testCol, mark, seats) {
	// staying still is 0
	if (offsetRow == 0 && offsetCol == 0) {
		return 0;
	}
	let row = testRow + offsetRow;
	let col = testCol + offsetCol;
	while (row >= 0 && row < seats.length && col >= 0 && col < seats[0].length) {
		const seat = seats[row][col];
		if (seat === mark) {
			return 1;
		} else if (seat === '#' || seat === 'L') {
			return 0;
		}
		row += offsetRow;
		col += offsetCol;
	}
	return 0;
}
