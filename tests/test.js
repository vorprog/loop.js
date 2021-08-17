const diff = require('diff');
const main = require('../src/main');

const loop = main.loop;
const kvp = main.keyValuePair;

const checkForDiscrepancies = (expected, actual) => {
  const differences = diff.diffJson(expected, actual);
  if (differences.length > 1) {
    const diffLog = loop(differences, (index, difference) => `${difference.added ? `DISCREPANCY.ACTUAL:` : difference.removed ? `DISCREPANCY.EXPECTED:` : ``} ${difference.value}`).join(``);
    throw Error(`Found unexpected discrepancies: \n${diffLog}`);
  }
}

const evenNumbers = [2, 4, 6, 8, 10];

const expectedEventNumbersDoubled = [4, 8, 12, 16, 20];
const evenNumbersDoubled = loop(evenNumbers, (key, value) => value * 2);
checkForDiscrepancies(expectedEventNumbersDoubled, evenNumbersDoubled);

const expectedDescendingEventNumbers = [10, 8, 6, 4, 2];
const descendingEvenNumbers = loop(evenNumbers, (key, value) => new kvp(evenNumbers.length - (key + 1), value));
checkForDiscrepancies(expectedDescendingEventNumbers, descendingEvenNumbers);

const expectedFilteredNumbers = [8, 10];
const filteredNumbers = loop(evenNumbers, (key, value) => (value > 6 ? value : null));
checkForDiscrepancies(filteredNumbers, expectedFilteredNumbers);

const car1 = {
  make: `Tesla`,
  model: `Cyber Truck`,
  year: `2021`,
  stock: 100,
  isElectric: true
};

const car2 = {
  make: `Ford`,
  model: `Mustang`,
  year: `1966`,
  stock: 7,
  isElectric: false
};

const words = [`foo`, `bar`, `blee`, `bla`, `meh`];

const expectedrandomWordValues = { make: `foo`, model: `bar`, year: `blee`, stock: `bla`, isElectric: `meh` };
const randomWordValues = loop(car1, (key, value, completedIterations) => new kvp(key, words[completedIterations]));
checkForDiscrepancies(expectedrandomWordValues, randomWordValues);

const expectedChangedCarValues = [`Ford`, `Mustang`, `1966`, 7, false];
const changedCarValues = loop(car1, key => car2[key]);
checkForDiscrepancies(expectedChangedCarValues, changedCarValues);

const expectedReKeyedCarObject = { foo: `Tesla`, bar: `Cyber Truck`, blee: `2021`, bla: 100, meh: true };
const reKeyedCarObject = loop(car1, (key, value, completedIterations) => new kvp(words[completedIterations], value));
checkForDiscrepancies(expectedReKeyedCarObject, reKeyedCarObject);

const expectedCarValuesArray = [`Tesla`, `Cyber Truck`, `2021`, 100, true];
const carValuesArray = loop(car1, (key, value) => value);
checkForDiscrepancies(expectedCarValuesArray, carValuesArray);

const expectedCountBy10Array = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
const countBy10Array = loop(10, key => key * 10);
checkForDiscrepancies(expectedCountBy10Array, countBy10Array)

console.log(`Tests successfully completed!`);
