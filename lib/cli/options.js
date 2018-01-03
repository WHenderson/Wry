'use strict';

const mri = require('mri');
const process = require('process');
const pkg = require('../util/package');

class UnknownArgument extends Error {
  constructor(msg) {
    super(`CLI: ${msg}`);
    this.type = 'cli';
    this.message = msg;
  }
}

function splitArgs(args) {
  args = args || process.argv.slice(2);

  const splitIndex = args.indexOf('--');

  if (splitIndex === -1)
    return [args, []];

  return [args.slice(0, splitIndex), args.slice(splitIndex + 1)];
}

function parse(args) {

  const [wryArgs, cmdArgs] = splitArgs(args);

  const options = mri(
    wryArgs,
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

  options._cmdArgs = cmdArgs;

  if (options._.length === 0)
    options._.push('default');

  return options;
}

parse.UnknownArgument = UnknownArgument;

module.exports = parse;