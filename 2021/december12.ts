import { readFileSync } from 'fs';

/**
 * https://adventofcode.com/2021/day/12
 */
const input = readFileSync('./december12.txt', 'utf-8');

console.log('star 1:');
console.log(star1());
console.log('star 2:');
console.log(star2());

type Graph = {[start: string]:string[]};

function star1() {

    function traverse(graph: Graph, history: string[], paths: string[][]): string[][] {
        const node = history[history.length - 1];
        if (node === 'end') {
            return [...paths, history];
        }
        graph[node]?.forEach(it => {
            if (!history.includes(it) || (it[0] >= 'A' && it[0] <= 'Z')) {
                paths = traverse(graph, [...history, it], paths);
            }
        });
        return paths;
    }


    const graph: Graph = {}
    input
        .split(/\r?\n\r?\n?/)
        .filter(Boolean)
        .map(it => it.split('-'))
        .forEach(([a, b]) => {
            if (a !== 'end') {
                if (graph[a]) {
                    graph[a].push(b);
                } else {
                    graph[a] = [b];
                }
            }
            if (b !== 'end') {
                if (graph[b]) {
                    graph[b].push(a);
                } else {
                    graph[b] = [a];
                }
            }
        })
    return traverse(graph, ['start'], []).length;
}

// copy paste
function star2() {

    function traverse(graph: Graph, history: string[], paths: string[][], smallCaveVisited: boolean): string[][] {
        const node = history[history.length - 1];
        if (node === 'end') {
            return [...paths, history];
        }
        graph[node]?.forEach(it => {
            if (!history.includes(it) || (it[0] >= 'A' && it[0] <= 'Z')) {
                paths = traverse(graph, [...history, it], paths, smallCaveVisited);
            } else if (!smallCaveVisited && it[0] >= 'a' && it[0] <= 'z' && it !== 'start') {
                paths = traverse(graph, [...history, it], paths, true);
            }
        });
        return paths;
    }


    const graph: Graph = {}
    input
        .split(/\r?\n\r?\n?/)
        .filter(Boolean)
        .map(it => it.split('-'))
        .forEach(([a, b]) => {
            if (a !== 'end') {
                if (graph[a]) {
                    graph[a].push(b);
                } else {
                    graph[a] = [b];
                }
            }
            if (b !== 'end') {
                if (graph[b]) {
                    graph[b].push(a);
                } else {
                    graph[b] = [a];
                }
            }
        })
    return traverse(graph, ['start'], [], false).length;
}
