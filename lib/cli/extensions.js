const WryError = require('../wryError');
const p = require('path');
const fs = require('fs');

function getModuleExtensionsList(packageJson, packageBase) {
  // No extensions
  if (!packageJson || packageJson.wry.moduleExtensions === false)
    return [];

  // Specific extensions, in order
  if (packageJson.wry.moduleExtensions instanceof Array)
    return packageJson.wry.moduleExtensions
      .map(dep => p.normalize(p.resolve(packageBase, 'node_modules', dep)));

  // All known extensions beginning with "wry"
  return ['dependencies', 'devDependencies', 'peerDependencies']
    .filter(dep => typeof packageJson[dep] === 'object')
    .map(dep => Object.keys(packageJson[dep]))
    .reduce((a,b) => a.concat(b), [])
    .filter(dep => /^wry\b/.test(dep))
    .map(dep => p.normalize(p.resolve(packageBase, 'node_modules', dep)));
}

function getLocalExtensionsList(packageJson, packageBase) {
  // Plugins is a list of local source files with plugins
  return (packageJson.wry.localExtensions || []).map((name) => p.normalize(p.resolve(packageBase, name)))
}

function getExtensionsList(packageJson, packageBase) {
  return getModuleExtensionsList(packageJson, packageBase)
    .concat(getLocalExtensionsList(packageJson, packageBase));
}

function applyExtensions(wry, extensionsList) {
  for (let extension of extensionsList) {
    try {
      const plugin = require(extension);
      wry.plugin(plugin);
    }
    catch (ex) {
      throw new WryError(`Unable to load extension \`${extension}\``, { innerError: ex });
    }
  }
}

// Find wryfile, get dir, search towards root for package.json
// Create a package module, distinguishing between the wry package and the target package

class Extensions {
  constructor(pkg) {
    this.pkg = Object.assign({ wry: {} }, this.pkg);
  }

  getModuleExtensionsList() {
    const packageJson = this.pkg;

    // No extensions
    if (!this.pkg || this.pkg.wry.moduleExtensions === false)
      return [];

    // Specific extensions, in order
    if (this.pkg.wry.moduleExtensions instanceof Array)
      return this.pkg.wry.moduleExtensions;

    // All known extensions beginning with "wry"
    return ['dependencies', 'devDependencies', 'peerDependencies']
      .filter(dep => typeof this.pkg[dep] === 'object')
      .map(dep => Object.keys(this.pkg[dep]))
      .reduce((a,b) => a.concat(b), [])
      .filter(dep => /^wry\b/.test(dep));
  }

  getLocalExtensionsList() {
    // Plugins is a list of local source files with plugins
    return (this.pkg.wry.localExtensions || []);
  }

  getExtensionsList() {
    return this.getModuleExtensionsList()
      .concat(this.getLocalExtensionsList());
  }

  static findPackageJson(pathWryFile) {
    let dir = pathWryFile;
    while (true) {
      const nextDir = p.dirname(dir);
      if (!nextDir || nextDir === dir)
        throw new Error('Unable to find package.json');

      const pathPackageJson = p.resolve(dir, 'package.json');
      try {
        fs.statSync(pathPackageJson);
        return pathPackageJson;
      }
      catch (ex) {
      }
    }
  }

  static applyExtensions(wry, pathWryFile, extensionsList) {
    const pathPackageJson = Extensions.findPackageJson(pathWryFile);
    const m = new Module(pathPackageJson, null);
    m.load(pathPackageJson);

    for (let extension of extensionsList) {
      try {
        const plugin = m.require(extension);
        wry.plugin(plugin);
      }
      catch (ex) {
        throw new WryError(`Unable to load extension \`${extension}\``, { innerError: ex });
      }
    }
  }
}

module.exports = Extensions;