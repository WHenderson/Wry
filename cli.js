'use strict';

const p = require('path');
const util = require('util');
const fs = require('fs');
const process = require('process');

const cli = require('./lib/cli');
const Wry = require('./lib/wry');
const WryError = require('./lib/wryError');

const readFileAsync = util.promisify(fs.readFile);

async function loadPackageJsonAsync() {
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

    const packageJson = await loadPackageJsonAsync();
    // Load extensions
    cli.extend.applyExtensions(
      wry,
      cli.extend.getExtensionsList(packageJson, o.cwd)
    );

    // Load wryFile
    const wryFilePath = p.normalize(p.resolve(o.cwd, packageJson?.wry?.wryfile || 'wryfile.js'));
    const wryFile = require(wryFilePath);
    if (typeof wryFile !== 'object')
      throw new WryError(`wryfile \`${wryFilePath}\` does not export an object`);

    const names = [];

    for (const [key, val] of Object.entries(wryFile)) {
      if (typeof val === 'function') {
        wry.plugin({name: key, func: val});
        names.push(key);
        continue;
      }

      if (typeof val === 'object') {
        const opt = Object.assign({ name: key }, val);
        wry.plugin(opt);
        names.push(opt.name);
        continue;
      }

      throw new WryError(`wryfile export \`${key}\` is of an invalid type`);
    }

    if (o.list) {
      names.forEach((name) => console.log(name));
      return;
    }

    await wry[o.mode](o.tasks.length ? o.tasks : ['default']).resolve([]);
  }
  catch (ex) {
    console.error(ex.message);
    if (!!ex.data)
      console.error(ex.data);
    process.exit(-1);
  }
})();