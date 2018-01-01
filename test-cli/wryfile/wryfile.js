module.exports = {
  $log: function () {
    return this.source('*.*').log();
  }
};