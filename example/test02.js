const ex = require('../lib/cli/extensions');

//const e = new ex('../test/fixtures/cli-moduleExtensions/package.json');

const modulePath = '../test-cli/wryfile/package.json';
const Module = module.constructor;

const m = new Module(modulePath, null);
m.load(modulePath);
const r = m.require('hello-world-npm');
/*const r = m.require;
const rr = m.require.resolve;
const resPath = require.resolve.call(this, 'glob');
const resM = m.require(resPath);
*/
const a = Module._load(modulePath);

console.log('done.');

// TODO: I need a module.require.resolve function for the extensions module


// Exports...
// Find package.json (perhaps add an option to specify it?)
// Load package.json as a module, exports is the json
// Parse dependencies etc
//
