#!/usr/bin/env node
'use strict';

const p = require('path');
const util = require('util');
const fs = require('fs');
const process = require('process');

const R = require('ramda');

const cli = require('./lib/cli');
const Wry = require('./lib/wry');
const WryError = require('./lib/wryError');

const readFileAsync = util.promisify(fs.readFile);

async function loadPackageJsonAsync(o) {
  const fn = p.normalize(p.resolve(o.cwd || '.', 'package.json'));
  try {
    const text = await readFileAsync(fn, {encoding: 'utf8'});
    return JSON.parse(text);
  }
  catch (ex) {
    return {
    }
  }
}

function loadWryFile(fn) {
  try {
    return require(fn);
  }
  catch (ex) {
    throw new WryError(`Unable to load wryfile \`${fn}\``);
  }
}


(async function (){
  try {
    const o = cli.options();

    if (o.help) {
      return cli.help();
    }

    if (o.version) {
      return cli.version();
    }

    const wry = new Wry();

    const packageJson = await loadPackageJsonAsync(o);

    if (typeof packageJson.wry === 'string')
      packageJson.wry = { wryfile: packageJson.wry };
    else if (typeof packageJson.wry !== 'object')
      packageJson.wry = {};

    if (packageJson.wry.wryfile !== 'string')
      packageJson.wry.wryfile = 'wryfile.js';

    // Load extensions
    cli.extend.applyExtensions(
      wry,
      cli.extend.getExtensionsList(packageJson, o.cwd)
    );

    // Load wryFile
    const wryFilePath = p.normalize(p.resolve(o.cwd, packageJson.wry.wryfile));
    const wryFile = require(wryFilePath);
    if (typeof wryFile !== 'object')
      throw new WryError(`wryfile \`${wryFilePath}\` does not export an object`);

    const names = Object.entries(wryFile).filter(([key, val]) => !key.startsWith('_') && typeof val === 'function').map(([key,val]) => key);

    if (o.list) {
      names.forEach((name) => console.log(name));
      return;
    }

    const invalidTasks = R.difference(o.tasks, names);
    if (invalidTasks.length !== 0)
      throw new WryError(`The requested task(s) (${invalidTasks.join()}) are not exported from \`${packageJson.wry.wryfile}\``)

    await wry[o.mode](o.tasks.map(task => wryFile[task].call(wryFile, wry, o._cmdArgs))).resolve([]);
    }
  catch (ex) {
    console.error(ex.message);
    if (!!ex.data)
      console.error(ex.data);
    process.exit(-1);
  }
})();