module.exports = {
  name: 'discard',
  func: function () {
    return async function(files) {
      return [];
    }
  }
};