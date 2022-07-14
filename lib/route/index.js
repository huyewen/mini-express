const methods = require('../utils/methods');
const Layer = require('./layer');
const Route = require('./route');
const { slice, flatten } = require('../utils')

function Router () {

  function router (req, res, next) {
    router.handleRouter(req, res, next);
  }

  Object.setPrototypeOf(router, proto);

  router.stack = [];

  return router;
}

const proto = Object.create(null);

proto.route = function (path) {
  const route = new Route(path)
  const layer = new Layer(path, route.dispatch.bind(route));

  layer.route = route;
  this.stack.push(layer);

  return route
}

proto.use = function (fn) {
  let path = '/';
  let offset = 0;

  if (typeof fn !== 'function') {
    let arg = fn;
    while (Array.isArray(arg) && arg.length) {
      arg = arg[0]
    }

    if (typeof arg !== 'function') {
      offset = 1;
      path = fn;
    }
  }

  const fns = flatten(slice.apply(arguments, offset));
  const self = this;

  fns.forEach(function (fn) {
    const layer = new Layer(path, fn);
    layer.route = undefined;
    self.stack.push(layer);
  })

  return this
}

methods.forEach(function (method) {
  proto[method] = function (path) {
    const route = this.route(path);
    route[method].apply(route, slice.call(arguments, 1));

    return this
  }
})


proto.handleRouter = function (req, res, done) {
  let index = 0;



}


module.exports = Router;