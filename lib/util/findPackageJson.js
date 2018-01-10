const p = require('path');
const fs = require('fs');

module.exports = function findPackageJson(start) {
  let dir = start;
  while (true) {
    try {
      const filePath = p.resolve(dir, 'package.json');
      fs.statSync(filePath);
      return filePath;
    }
    catch (ex)
    {
    }

    const next = p.dirname(dir);
    if (!next || next === dir)
      throw new Error(`Unable to find package.json under \`${start}\``);

    dir = next;
  }
};