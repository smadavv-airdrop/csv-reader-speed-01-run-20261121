import { readCsv } from './solve.js';

// Test the exact Test 2 case
const test2 = `a,b,c\r
1,2,3\r
4,5,6\r`;

console.log("Test 2:", JSON.stringify(readCsv({text: test2, header: true}), null, 2));

// Also test with baseline
import * as lib from '/home/ubuntu/makefun/kit-csv-reader/csv-reader-speed-01-run-20261121-kit/baselines/csv-reader/vendor/csv-reader/index.js';
const fn = lib["readCsv"] ?? (lib.default != null && typeof lib.default["readCsv"] === 'function' ? lib.default["readCsv"].bind(lib.default) : undefined);
console.log("Baseline:", JSON.stringify(fn({text: test2, header: true}), null, 2));
