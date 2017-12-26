'use strict';

const cli = require('./lib/cli');

(function (){
  const o = cli.options();
  const t = o.tasks.length ? o.tasks : ['default'];

  if (o.help) {
    return cli.help();
  }

  if (o.version) {
    return cli.version();
  }

  return cli.help();
})();