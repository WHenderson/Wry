const WryError = require('../wryError');

function getModuleExtensionsList(packageJson, packageBase) {
  // No extensions
  if (!packageJson || packageJson.wry.moduleExtensions === false)
    return [];

  // Specific extensions, in order
  if (packageJson.wry.moduleExtensions instanceof Array)
    return packageJson.wry.moduleExtensions;

  // All known extensions beginning with "wry"
  return ['dependencies', 'devDependencies', 'peerDependencies']
    .filter(dep => typeof packageJson[dep] === 'object')
    .map(dep => Object.keys(packageJson[dep]))
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

module.exports = {
  getModuleExtensionsList,
  getLocalExtensionsList,
  getExtensionsList,
  applyExtensions
};