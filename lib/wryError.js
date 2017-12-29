const pkg = require('./util/package');

module.exports = class WryError extends Error {
  constructor(msg, data) {
    super(`${pkg.Name}: ${msg}`);
    this.data = data;
  }
};