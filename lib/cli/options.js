'use strict';

const mri = require('mri');
const process = require('process');

const pkg = require('../util/package');
const CliError = require('./cliError');
const UnknownArgumentError = require('./unknownArgumentError');

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
        v: 'version',
        m: 'mode',
        h: 'help',
        l: 'list',
        d: 'cwd',
        _: 'tasks'
      },
      boolean: [
        'v', 'h', 'l'
      ],
      unknown: key => { throw new UnknownArgumentError(key); }
    }
  );

  options._cmdArgs = cmdArgs;

  if (!['serial', 'parallel'].includes(options.mode))
    throw new CliError(`Unknown mode \`${options.mode}\`. Should be either \`serial\` or \`parallel\`.`)

  if (options.cwd === '')
    throw new CliError(`Invalid cwd specified`);

  if (options._.length === 0)
    options._.push('default');

  return options;
}

module.exports = parse;