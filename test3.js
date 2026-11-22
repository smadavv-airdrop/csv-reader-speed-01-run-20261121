import { readCsv } from './solve.js';
import * as lib from '/home/ubuntu/makefun/kit-csv-reader/csv-reader-speed-01-run-20261121-kit/baselines/csv-reader/vendor/csv-reader/index.js';
const fn = lib["readCsv"] ?? (lib.default != null && typeof lib.default["readCsv"] === 'function' ? lib.default["readCsv"].bind(lib.default) : undefined);

// Load the practice input
import fs from 'fs';
const cases = JSON.parse(fs.readFileSync('/home/ubuntu/makefun/kit-csv-reader/csv-reader-speed-01-run-20261121-kit/practice/input/cases.json', 'utf-8'));
const expected = JSON.parse(fs.readFileSync('/home/ubuntu/makefun/kit-csv-reader/csv-reader-speed-01-run-20261121-kit/practice/reference/expected.json', 'utf-8'));

// Test first case
const input = cases[0].input;
const myResult = readCsv(input);
const baselineResult = fn(input);
const expectedResult = expected[0];

console.log("My result:", JSON.stringify(myResult, null, 2));
console.log("Baseline:", JSON.stringify(baselineResult, null, 2));
console.log("Expected:", JSON.stringify(expectedResult, null, 2));
console.log("Match baseline:", JSON.stringify(myResult) === JSON.stringify(baselineResult));
console.log("Match expected:", JSON.stringify(myResult) === JSON.stringify(expectedResult));
