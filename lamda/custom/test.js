const assert = require('assert');
const findCountry = require('./lookup');

assert.strictEqual(findCountry('india').capital, 'New Delhi');
assert.strictEqual(findCountry('INDIA').capital, 'New Delhi');
assert.strictEqual(findCountry('Atlantis'), undefined);
assert.strictEqual(findCountry(undefined), undefined);
assert.strictEqual(findCountry(''), undefined);
console.log('ok');
