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

    const names = [];

    for (const [key, val] of Object.entries(wryFile)) {
      if (typeof val === 'function') {
        Wry.plugin({
          name: key,
          func: function (...args) {
            const self = this;
            return async function () {
              return await val.call(self, ...args).resolve(); // TODO: wryfile functions maybe shouldn't be regular plugins expecting a "files" argument?
            }
          }
        });
        names.push(key);
        continue;
      }

      if (typeof val === 'object') {
        const opt = Object.assign({ name: key }, val);
        Wry.plugin(opt);
        names.push(opt.name);
        continue;
      }

      throw new WryError(`wryfile export \`${key}\` is of an invalid type`);
    }

    if (o.list) {
      names.forEach((name) => console.log(name));
      return;
    }

    const tasks = o.tasks.length ? o.tasks : ['default'];

    const invalidTasks = R.difference(tasks, names);
    if (invalidTasks.length !== 0) {
      throw new WryError(`The requested task(s) (${tasks.join()}) are not listed in \`${packageJson.wry.wryfile}\``)
    }


    await wry[o.mode](tasks.map(task => wry[task]())).resolve([]);
  }
  catch (ex) {
    console.error(ex.message);
    if (!!ex.data)
      console.error(ex.data);
    process.exit(-1);
  }
})();