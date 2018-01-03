const pkg = require('../util/package');

module.exports = function () {
  console.log(`
Usage: ${pkg.name} [options] [tasks] [-- args...]

Options
  -m  --mode=MODE   Run in 'parallel' or 'serial'. Default: 'serial'
  -d  --cwd=DIR     Set  ${pkg.Name}'s home directory. Default: '.'
  -l  --list        Display all available tasks.
  -v  --version     Display  ${pkg.Name}'s version.
  -h  --help        Display this help text.

Examples
  ${pkg.name} -d=/lib
  ${pkg.name} -m=parallel task1 task2
  ${pkg.name} --mode=serial task1 task2 -- arg1 arg2  
  ${pkg.name} --list
  `.trim());
};