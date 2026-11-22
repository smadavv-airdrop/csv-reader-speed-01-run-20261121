const { run } = require('./solve.js');
const lib = require('./vendor/csv-reader/index.js');
const fn = lib["readCsv"] ?? (lib.default != null && typeof lib.default["readCsv"] === 'function' ? lib.default["readCsv"].bind(lib.default) : undefined);
const cases = JSON.parse(require('fs').readFileSync('/home/ubuntu/makefun/kit-csv-reader/csv-reader-speed-01-run-20261121-kit/practice/input/cases.json', 'utf-8'));
const expected = JSON.parse(require('fs').readFileSync('/home/ubuntu/makefun/kit-csv-reader/csv-reader-speed-01-run-20261121-kit/practice/reference/expected.json', 'utf-8'));
for (let i = 0; i < 6; i++) {
  const input = cases[i].input;
  const myResult = run(input);
  const baselineResult = fn(input);
  const expectedResult = expected[i];
  console.log(`Case ${i+1}:`);
  console.log('My:', JSON.stringify(myResult));
  console.log('Baseline:', JSON.stringify(baselineResult));
  console.log('Expected:', JSON.stringify(expectedResult));
  console.log('Match baseline:', JSON.stringify(myResult) === JSON.stringify(baselineResult));
  console.log('Match expected:', JSON.stringify(myResult) === JSON.stringify(expectedResult));
  if (JSON.stringify(myResult) !== JSON.stringify(baselineResult)) process.exit(1);
}
console.log('All 6 cases match baseline');
