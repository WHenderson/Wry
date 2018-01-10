const WryError = require('../wryError');

module.exports = class CliError extends WryError {
  constructor(msg) {
    super(`CLI: ${msg}`);
  }
};