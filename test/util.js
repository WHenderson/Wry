import test from 'ava';

const findPackageJson = require('../lib/util/findPackageJson');
const p = require('path');

test('findPackageJson', t => {
  t.deepEqual(
    findPackageJson(p.resolve(__dirname)),
    p.resolve(__dirname, '../package.json')
  );

  t.throws(() => findPackageJson('/'));
});
