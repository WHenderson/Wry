const pkg = require('../../package');

module.exports = Object.assign(
  {},
  pkg,
  {
    Name: pkg.name[0].toUpperCase() + pkg.name.slice(1)
  }
);