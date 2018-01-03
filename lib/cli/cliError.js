const WryError = require('../wryError');

module.exports = class UnknownArgument extends Error {
  constructor(msg) {
    super(`CLI: ${msg}`);
  }
};