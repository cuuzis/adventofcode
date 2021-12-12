import { readFileSync } from 'fs';

/**
 * https://adventofcode.com/2021/day/8
 */
const input = readFileSync('./december08.txt', 'utf-8');

console.log('star 1:');
console.log(star1());
console.log('star 2:');
console.log(star2());

function star1() {
    // hacked together in browser console using document.body.innerText as input
    return input.split(/\r?\n\r?\n?/)
        .map(it => it.split(' | ')[1])
        .filter(it => it)
        .reduce((acc, currentValue) => acc + currentValue.split(' ').filter(it => it.length === 2 || it.length === 4 || it.length === 3 || it.length === 7).length, 0)
}

function star2() {

    function valueOfLine(inputLine: string) {

        // Analysis of number representations:
        //
        //                    number | represented by | letters in representation
        //                       0         abc efg          6
        //                       1           c  f           2
        //                       2         a cde g          5
        //                       3         a cd fg          5
        //                       4          bcd f           4
        //                       5         ab d fg          5
        //                       6         ab defg          6
        //                       7         a c  f           3
        //                       8         abcdefg          7
        //                       9         abcd fg          6
        // occurences in 0-9:              8687497



        function getLettersByOccurences(occurences: number) {
            return Object.entries(letters)
                .filter(([_, value]) => value === occurences)
                .map(([key, _]) => key);
        }

        function findNumberByItsLetters(...lettersAsArgs: string[]) {
            return numberRepresentations.filter(it => it.length === lettersAsArgs.length && lettersAsArgs.every(value => it.includes(value)))[0];
        }

        function getNumberOf(lettersShown: string) {
            const lettersShownArray = lettersShown.split('');
            return decodedNumbers.findIndex(it => it.length === lettersShownArray.length && lettersShownArray.every(value => it.includes(value)));
        }

        const numberRepresentations = inputLine.split(' | ').map(it => it.split(' '))[0];
        // easy numbers
        const one = numberRepresentations.filter(it => it.length === 2)[0];
        const four = numberRepresentations.filter(it => it.length === 4)[0];
        const seven = numberRepresentations.filter(it => it.length === 3)[0];
        const eight = numberRepresentations.filter(it => it.length === 7)[0];

        // count the letter occurrences within numbers 0-9
        const letters = inputLine
            .split(' | ')[0]
            .split('')
            .filter(it => it >= 'a' && it <= 'g')
            .reduce((acc, currentValue) => {
                if (currentValue && acc[currentValue]) {
                    acc[currentValue]++;
                } else if (currentValue && !acc[currentValue]) {
                    acc[currentValue] = 1;
                }
                return acc;
            }, {} as {[key: string]: number})
        // console.log(numberRepresentations)

        // decode each display "letter"
        const a = getLettersByOccurences(8).filter(it => !one!.includes(it))[0];
        const b = getLettersByOccurences(6)[0];
        const c = getLettersByOccurences(8).filter(it => one!.includes(it))[0];
        const d = getLettersByOccurences(7).filter(it => four!.includes(it))[0];
        const e = getLettersByOccurences(4)[0];
        const f = getLettersByOccurences(9)[0];
        const g = getLettersByOccurences(7).filter(it => !four!.includes(it))[0];

        // decode remaining numbers
        const zero = findNumberByItsLetters(a,b,c,e,f,g);
        const two = findNumberByItsLetters(a,c,d,e,g);
        const three = findNumberByItsLetters(a,c,d,f,g);
        const five = findNumberByItsLetters(a,b,d,f,g);
        const six = findNumberByItsLetters(a,b,d,e,f,g);
        const nine = findNumberByItsLetters(a,b,c,d,f,g);
        const decodedNumbers = [zero, one, two, three, four, five, six, seven, eight, nine];

        // return value of the digits shown
        return inputLine.split(' | ')
            .map(it => it.split(' '))[1]
            .reduce((acc, currentValue) => getNumberOf(currentValue) + acc * 10, 0);
    }


    // sum up all line values
    return input
        .split(/\r?\n\r?\n?/)
        .filter(Boolean)
        .reduce((acc, currentValue) => valueOfLine(currentValue) + acc, 0);
}

