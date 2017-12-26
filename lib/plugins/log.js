const File = require('../file');

module.exports = {
  name: 'log',
  func: function (opts) {
    if (typeof opts === 'string')
      opts = { name: opts };

    opts = Object.assign(
      {
        include: undefined,
        exclude: undefined,
        name : undefined
      },
      opts);

    const {include, exclude, name} = opts;

    return function (files) {
      files.forEach((file) => {
        let output = {};
        if (include === undefined)
        {
          if (exclude === undefined)
          {
            output = { meta: file.meta }
          }
          else {

          }
        }
        else {
          if (exclude === undefined)
          {

          }
          else {

          }
        }

        if (name !== undefined)
          console.log(name, ':', output);
        else
          console.log(output)
      });
      return files;
    }
  }
};