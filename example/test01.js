const Wry = require('../');
const util = require('util');

(async function () {

  const wry = new Wry();

  const pipeline = (function (){
    return this
      .source('../lib')
      .log('all    ')
      .if(
        (file) => file.meta.name.startsWith('../lib/plugins/'),
        this.log('+plugin').if((file) => file.meta.name.startsWith('../lib/plugins/s'), this.log('+s     '), this.log('!s     ')),
        this.log('-plugin')
      )
      .log('all    ')
  }).call(wry);

  console.log(util.inspect(pipeline.graphs, false, null));
  await pipeline.resolve();
})();