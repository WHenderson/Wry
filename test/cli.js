import test from 'ava';

const cli = require('../lib/cli');
const p = require('path');

test('options', t => {
  const oDefault =  {
    _: ['default'],
    _cmdArgs: [],
    cwd: '.',
    d: '.',
    m: 'serial',
    mode: 'serial',
    tasks: ['default']
  };

  t.deepEqual(cli.options([]), oDefault, 'Defaults');

  t.throws(() => cli.options(['-m', 'hmm']));
  t.deepEqual(cli.options(['-m', 'parallel']), Object.assign({}, oDefault, { m: 'parallel', mode: 'parallel' }), '-m parallel');
  t.deepEqual(cli.options(['-m', 'serial']), Object.assign({}, oDefault, { m: 'serial', mode: 'serial' }), '-m serial');
  t.deepEqual(cli.options(['-m', 'parallel']), cli.options(['--mode', 'parallel']))
  t.deepEqual(cli.options(['-m', 'parallel']), cli.options(['--mode=parallel']))

  t.throws(() => cli.options(['-d']));
  t.deepEqual(cli.options(['-d', '../']), Object.assign({}, oDefault, { d: '../', cwd: '../'}), '-d ../');
  t.deepEqual(cli.options(['--cwd', '../']), Object.assign({}, oDefault, { d: '../', cwd: '../'}), '-d ../');

  t.deepEqual(cli.options(['-l']), Object.assign({}, oDefault, { l: true, list: true}), '-l');
  t.deepEqual(cli.options(['--list']), Object.assign({}, oDefault, { l: true, list: true}), '-l');

  t.deepEqual(cli.options(['-v']), Object.assign({}, oDefault, { v: true, version: true}), '-v');
  t.deepEqual(cli.options(['--version']), Object.assign({}, oDefault, { v: true, version: true}), '-v');

  t.deepEqual(cli.options(['-h']), Object.assign({}, oDefault, { h: true, help: true}), '-h');
  t.deepEqual(cli.options(['--help']), Object.assign({}, oDefault, { h: true, help: true}), '-help');

  t.deepEqual(cli.options(['cmd1', 'cmd2']), Object.assign({}, oDefault, { _: ['cmd1', 'cmd2'], tasks: ['cmd1', 'cmd2'] }), 'cmd1 cmd2');
  t.deepEqual(cli.options(['cmd1', '--', 'arg1', 'arg2']), Object.assign({}, oDefault, { _: ['cmd1'], tasks: ['cmd1'], _cmdArgs: ['arg1', 'arg2'] }), 'cmd1 -- arg1 arg2');

  t.throws(() => cli.options(['--bad-arg']));
});

test('WryPackageModule', t => {
  const getFixture  = (dir) => p.resolve(__dirname, 'fixtures', dir, 'package.json');

  t.deepEqual(
    new cli.WryPackageModule(getFixture('cli-none')).pkg,
    {
      "name": "cli-none",
      "version": "0.0.1",
      "dependencies": {},
      "wry": {
        "wryFile": "wryfile"
      }
    }
  );

  t.deepEqual(
    new cli.WryPackageModule(getFixture('cli-wryFile')).pkg,
    {
      "name": "cli-wryFile",
      "version": "0.0.1",
      "dependencies": {},
      "wry": {
        "wryFile": "myWryFile.js"
      }
    }
  );

  t.deepEqual(
    new cli.WryPackageModule(getFixture('cli-none')).getModuleExtensionsList(),
    []
  );

  t.deepEqual(
    new cli.WryPackageModule(getFixture('cli-moduleExtensions')).getModuleExtensionsList(),
    [
      'a',
      'b'
    ],
  );

  t.deepEqual(
    new cli.WryPackageModule(getFixture('cli-dependencies')).getModuleExtensionsList(),
    [
      'wry-dep-b',
      'wry/dep-c',
      'wry-devDep-b',
      'wry/devDep-c',
      'wry-peerDep-b',
      'wry/peerDep-c'
    ]
  );

  t.deepEqual(
    new cli.WryPackageModule(getFixture('cli-none')).getLocalExtensionsList(),
    []
  );

  t.deepEqual(
    new cli.WryPackageModule(getFixture('cli-localExtensions')).getLocalExtensionsList(),
    [
      'a',
      'b'
    ]
  );

  t.deepEqual(
    new cli.WryPackageModule(getFixture('cli-none')).getExtensionsList(),
    []
  );

  t.deepEqual(
    new cli.WryPackageModule(getFixture('cli-localExtensions')).getExtensionsList(),
    new cli.WryPackageModule(getFixture('cli-localExtensions')).getLocalExtensionsList()
  );

  t.deepEqual(
    new cli.WryPackageModule(getFixture('cli-moduleExtensions')).getExtensionsList(),
    new cli.WryPackageModule(getFixture('cli-moduleExtensions')).getModuleExtensionsList()
  );

  t.deepEqual(
    new cli.WryPackageModule(getFixture('cli-all')).getExtensionsList(),
    [
      'module-a',
      'module-b',
      "local-a",
      "local-b"
    ]
  );

  t.deepEqual(
    new cli.WryPackageModule(getFixture('cli-dependenciesAndLocalExtensions')).getExtensionsList(),
    [
      'wry-dep-b',
      'wry/dep-c',
      'wry-devDep-b',
      'wry/devDep-c',
      'wry-peerDep-b',
      'wry/peerDep-c',
      "local-a",
      "local-b"
    ]
  );

  t.deepEqual(
    new cli.WryPackageModule(getFixture('cli-noModuleExtensions')).getExtensionsList(),
    []
  );
});
