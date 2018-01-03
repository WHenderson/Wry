module.exports = {
  sources: '*.*',

  $log: function (wry, args) {
    console.log('args:', args);
    return wry.source(this.sources).log();
  }
};