'use strict';

const mri = require('mri');
const process = require('process');
const pkg = require('../util/package');

class UnknownArgument extends Error {
  constructor(msg) {
    super();
    this.type = 'cli';
    this.message = msg;
  }
}

function parse(args) {
  const options = mri(
    args || process.argv.slice(2),
    {
      default: {
        cwd: '.',
        mode: 'serial'
      },
      alias: {
        v: 'verbose',
        m: 'mode',
        h: 'help',
        l: 'list',
        d: 'cwd',
        _: 'tasks'
      },
      unknown: key => { throw new UnknownArgument(`Unkown option: \`${key}\`. Run \`${pkg.name} -h\` to see available options.`); }
    }
  );

  options.cwd = options.cwd || '.';

  return options;
}

parse.UnknownArgument = UnknownArgument;

module.exports = parse;