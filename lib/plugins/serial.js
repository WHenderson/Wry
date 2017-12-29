const R = require('ramda');

module.exports = {
  name: 'serial',
  func: function (...tasks) {
    tasks = R.flatten(tasks);

    return async function (files) {
      const outputs = [];

      for (let task of tasks) {
        const output = await task(files).resolve(files);
        outputs.push(...output);
      }

      return outputs;
    }
  }
};