const R = require('ramda');
const File = require('../file');
const globby = require('globby');

module.exports = {
  name: 'source',
  func: function (...args) {
    return async function(files) {
      const sources = await globby(...args);
      return files.concat(sources.map((name) => new File({name: name})));
    }
  }
};