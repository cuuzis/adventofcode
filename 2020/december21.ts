import {readFileSync} from 'fs';

/**
 * https://adventofcode.com/2020/day/21
 */
const input = readFileSync('./december21.txt', 'utf-8');

const allIngredients = new Set<string>()
const ingredientsByAllergen: { [allergen: string]: string[] } = {}
mapIngredients()

console.log(star1()); // 1945
console.log(star2()); // pgnpx,srmsh,ksdgk,dskjpq,nvbrx,khqsk,zbkbgp,xzb


function mapIngredients(): { [allergen: string]: string[] } {
    const lines = input
        .split(/\r?\n/)
        .filter(line => line != '')
    for (let line of lines) {
        const ingredients = line.substring(0, line.indexOf(' (')).split(' ')
        const allergens = line.substring(line.indexOf('(contains ') + '(contains '.length, line.indexOf(')')).split(', ')
        ingredients.forEach(i => allIngredients.add(i))
        for (let allergen of allergens) {
            if (ingredientsByAllergen[allergen]) {
                // narrow down
                ingredientsByAllergen[allergen] = ingredientsByAllergen[allergen].filter(it => ingredients.find(ingredient => it == ingredient))
            } else {
                ingredientsByAllergen[allergen] = ingredients
            }
        }
    }

    /// copy-paste from december16.ts
    let keysToCheck = Object.keys(ingredientsByAllergen)
    while (true) {
        const key = keysToCheck.find(k => ingredientsByAllergen[k].length == 1)
        if (key) {
            keysToCheck = keysToCheck.filter(it => it !== key)
            for (const k of keysToCheck) {
                ingredientsByAllergen[k] = ingredientsByAllergen[k].filter((it: any) => it !== ingredientsByAllergen[key][0])
            }
        } else {
            break
        }
    }
    ///

    return ingredientsByAllergen
}


function star1() {
    return Array.from(allIngredients.values())
        // filter ingredients without allergen mapping
        .filter(ingredient => !Object.values(ingredientsByAllergen).map(it => it[0]).find(it => ingredient == it))
        // count all input mentions of these ingredients
        .reduce((acc, ingr) => acc + (input.match(new RegExp('\\b' + ingr + '\\b', 'g')) || []).length, 0)
}


function star2() {
    return Object.keys(ingredientsByAllergen)
        .sort()
        .map(key => ingredientsByAllergen[key][0])
        .join()
}



