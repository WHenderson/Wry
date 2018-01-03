const CliError = require('./cliError');
const pkg = require('../util/package');

module.exports = class UnknownArgument extends CliError {
  constructor(opt) {
    super(`Unknown option: \`${opt}\`. Run \`${pkg.name} -h\` to see available options.`);
  }
};