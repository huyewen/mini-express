
const methods = require('../utils/methods');
const { slice } = require('../utils/index');
const Layer = require('./layer');

function Route (path) {
  this.path = path;

  this.stack = [];
}

const proto = Route.prototype

methods.forEach(function (method) {
  proto[method] = function () {
    const handlers = slice.call(arguments);
    const self = this;

    handlers.forEach(function (handler) {
      const layer = new Layer('/', handler);
      layer.method = method;
      self.stack.push(layer);
    })

    return this
  }
})

proto.dispatch = function (req, res, done) {
  let index = 0;
  const stack = this.stack;

  if (stack.length === 0) {
    return done();
  }

  next();

  function next (err) {

    if (err) {
      return done(err);
    }

    const layer = stack[index++];

    if (!layer) {
      return done(); // 这里的done为Router中的next
    }

    if (layer.method && layer.method === req.method.toLowerCase()) {
      layer.handleLayer(req, res, next);
    } else {
      next()
    }

  }
}

module.exports = Route;