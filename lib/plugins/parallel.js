const R = require('ramda');

module.exports = {
  name: 'parallel',
  func: function (...tasks) {
    tasks = R.flatten(tasks);

    return async function (files) {
      return await Promise
        .all(tasks.map(task => task.resolve(files)))
        .then(arrayOfOutput => {
          const outputs = [];
          arrayOfOutput.forEach(output => outpus.push(...output))
          return outputs;
        });
    }
  }
};