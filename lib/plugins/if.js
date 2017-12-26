const R = require('ramda');

module.exports = {
  name: 'if',
  func: function ($if, $then, $else) {
    return {
      func: async function (files) {
        let thenFiles = [];
        let elseFiles = [];
        files.forEach((file) => {
          if ($if(file))
            thenFiles.push(file);
          else
            elseFiles.push(file);
        });

        thenFiles = await $then.resolve(thenFiles);
        elseFiles = await $else.resolve(elseFiles);

        return thenFiles.concat(elseFiles);
      },
      graph: {
        outputs: {
          true: R.append({next: '../'}, $then.graphs),
          false: R.append({next: '../'}, $else.graphs)
        }
      }
    }
  }
};