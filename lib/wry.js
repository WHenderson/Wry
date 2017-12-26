'use strict';

const R = require('ramda');

class Wry {
  constructor() {
    // TODO
  }

  static plugin({name, ...x}) {
    this.Continue.plugin(Object.assign({ name }, x));
    this.prototype[name] = function (...args) {
      // Create an unresolved Continue
      const cont = new Wry.Continue();
      return cont[name](...args);
    }
  }
}

Wry.Continue = class Continue extends Promise {
  constructor(executor) {
    switch (typeof executor) {
      case 'function':
        // Resolving constructor
        super(executor);
        break;

      case 'undefined':
        // Unresolved constructor
        let deferredResolve;
        const self = new Continue(function (resolve, reject) {
          deferredResolve = resolve;
        });
        self.resolve = function (files=[]) {
          deferredResolve(files);
          return this;
        };
        self.clone = function () {
          return new Wry(executor);
        };
        return self;

      default:
        // Resolved constructor
        return new Continue(function (resolve, reject) {
          resolve(executor);
        });
    }
  }

  then(onFulfilled, onRejected, graph, clone) {
    // siblings are called with a new 'start' context
    const self = this;
    const start = new Wry();
    const newSelf = super.then.call(
      this,
      onFulfilled ? onFulfilled.bind(start) : onFulfilled,
      onRejected ? onRejected.bind(start) : onRejected
    );

    // migrate resolver
    if (this.resolve) {
      newSelf.resolve = this.resolve;
    }

    // build new graph
    if (this.graphs || graph) {
      const lhsGraphs = this.graphs || [];
      const rhsGraphs = graph ? [graph] : [];
      const graphs = R.concat(lhsGraphs, rhsGraphs);
      if (graphs.length)
        newSelf.graphs = graphs;
    }

    // construct clone operation
    if (this.clone && clone) {
      newSelf.clone = function () {
        return clone.call(self.clone());
      }
    }

    return newSelf;
  }

  static plugin({ name, mode='group', func }) {
    this.prototype[name] = function plug(...args) {
      const self = this;

      // call the outer plugin ahead of Promise resolution
      // plugins can return either:
      //   func
      //   or
      //   { func, graph }
      // where func is the inner plugin which works on the actual files, and
      // graph, which overrides the default graph
      const graph = { name };
      let apply = func.apply(this, args);
      if (typeof apply === 'function') {
        Object.assign(graph, apply.graph);
      }
      else {
        Object.assign(graph, apply.graph);
        apply = apply.func;
      }

      // plugins are actually a fancy 'then'
      return this.then(
        function (files) {
          switch (mode) {
            case 'parallel':
              // TODO
              break;
            case 'serial':
              // TODO
              break;
            default:
              // Group
              return apply.call(this, files);
          }
        },
        undefined,
        graph,
        function () { return plug.call(this, ...args); }
      );
    }
  }
};

// Include standard plugins
require('./plugins').forEach((plugin) => Wry.plugin(plugin));

module.exports = Wry;