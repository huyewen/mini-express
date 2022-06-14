const methods = require('../utils/methods');
const Layer = require('./layer');
const Route = require('./route');
const { slice } = require('../utils')

function Router () {

  function router (req, res, next) {
    router.handle(req, res, next);
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

proto.use = function (path) {

}

methods.forEach(function (method) {
  proto[method] = function (path) {
    const route = this.route(path);
    route[method].apply(route, slice.call(arguments, 1));

    return this
  }
})


proto.handleRouter = function (req, res, done) {

}


module.exports = Router;