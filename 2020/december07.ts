import { readFileSync } from 'fs';


const input = readFileSync('./december07.txt', 'utf-8');

console.log(star1());
console.log(star2());


interface Bag {
    type: string;
    colour: string;
    amount?: number;
}



function star1() {
    const parentBagsByKey: {[key: string]: Bag[]} = {};
    for (const line of input.split(/\r?\n/)) {
        const words = line.split(' ');
        const parentBag: Bag = {type: words[0], colour: words[1]};
        if (words[4] === 'no') {
            // contain no other bags
        } else {
            let i = 4;
            while (i < words.length) {
                const numberOfChildBags: number = Number(words[i]);
                const childBag: Bag = {type: words[i + 1], colour: words[i + 2] }
                addParent(childBag, parentBag);
                i += 4;
            }
        }
    }
    let colours = new Set<string>();
    for (const bag of parentBagsByKey['shiny' + 'gold']) {
        addColour(bag.type + bag.colour);
    }

    return colours.size;

    function addParent(child: Bag, parent: Bag) {
        const childKey = child.type + child.colour;
        if (!parentBagsByKey[childKey]) {
            parentBagsByKey[childKey] = [];
        }
        parentBagsByKey[childKey].push(parent);
    }

    function addColour(colourKey: string) {
        colours.add(colourKey);
        if (parentBagsByKey[colourKey]) {
            for (const bag of parentBagsByKey[colourKey]) {
                addColour(bag.type + bag.colour);
            }
        }
    }
}

function star2() {
    const childBagsByKey: {[key: string]: Bag[]} = {};
    for (const line of input.split(/\r?\n/)) {
        const words = line.split(' ');
        const parentBag: Bag = {type: words[0], colour: words[1]};
        if (words[4] === 'no') {
            // contain no other bags
        } else {
            let i = 4;
            while (i < words.length) {
                const numberOfChildBags: number = Number(words[i]);
                const childBag: Bag = {type: words[i + 1], colour: words[i + 2], amount: numberOfChildBags }
                addChild(childBag, parentBag);
                i += 4;
            }
        }
    }
    let sum = 0;
    sumChildren('shiny' + 'gold', 1);
    return sum;

    function addChild(child: Bag, parent: Bag) {
        const parentKey = parent.type + parent.colour;
        if (!childBagsByKey[parentKey]) {
            childBagsByKey[parentKey] = [];
        }
        childBagsByKey[parentKey].push(child);
    }

    function sumChildren(parentKey: string, multiplier: number) {
        if (childBagsByKey[parentKey]) {
            for (const childBag of childBagsByKey[parentKey]) {
                sum += childBag.amount * multiplier;
                sumChildren(childBag.type + childBag.colour, childBag.amount * multiplier);
            }
        }
    }
}
