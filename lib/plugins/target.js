const R = require('ramda');
const File = require('../file');
const globby = require('globby');

module.exports = {
  name: 'target',
  func: function (...args) {
    return async function(files) {
      // TODO
      return files;
    }
  }
};