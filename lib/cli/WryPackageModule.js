const Module = module.constructor;

module.exports = class WryPackageModule {
  constructor(filePath) {
    const defaults = {
      wry: {
        wryFile: 'wryfile'
      }
    };

    this.module = new Module(filePath, null);
    this.module.load(filePath);
    if (typeof this.module.exports.wry === 'string') {
      this.pkg = Object.assign(
        {},
        this.module.exports,
        defaults,
        { wry: { wryFile: this.module.exports.wry }}
      );
    }
    else {
      this.pkg = Object.assign(
        defaults,
        this.module.exports
      );
    }
  }

  getModuleExtensionsList() {
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
};