module.exports = {
  name: 'pass',
  func: function () {
    return async function(files) {
      return files;
    }
  }
};