const path = require('path');

class File {
  constructor(meta, prev) {
    Object.defineProperty(this, 'meta', {
      enumerable: true,
      configurable: false,
      writable: false,
      value: meta
    });
  }

  // Clone the current object
  clone(...meta) {
    // TODO: what a mess!
    return new (this.constructor[Symbol.species] || this.constructor)(Object.assign(this.meta, ...meta, { prev: this }));
  }

  // Think more about the default methods here

  get prev() {
    return this.meta.prev;
  }

  get basepath() {
    return this.meta.basepath;
  }
  setBasepath(val) {
    return this.clone({ basepath: val });
  }

  get path() {
    return this.meta.path;
  }
  setPath(val) {
    return this.clone({ path: val });
  }

  get extname() {
    return path.extname(this.path);
  }
  setExtname(val) {
    return this.clone({ path: path.format(Object.assign(path.parse(this.path), { base: undefined, ext: val })) });
  }

  get basename() {
    return path.basename(this.path);
  }
  setBasename(val) {
    return this.clone({ path: path.format(Object.assign(path.parse(this.path), { base: val })) });
  }

  get dirname() {
    return path.dirname(this.path);
  }
  setDirname(val) {
    return this.clone({ path: path.format(Object.assign(path.parse(this.path), { dir: val })) });
  }

  get data() {
    return this.meta.data || null;
  }
  setData(val) {
    return this.clone({ data: val });
  }
}

module.exports = File;