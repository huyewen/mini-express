const http = require('http');
const { off } = require('process');
const url = require('url');
const Router = require('./route');

const {
  methods,
  hasOwnProperty,
  slice,
  finalHandler,
  flatten
} = require('./utils');


const app = exports = module.exports = {}

app.lazyRouter = function () {
  if (!this._router) {
    this._router = new Router()
  }
}

methods.forEach(function (method) {
  app[method] = function () {

    this.lazyRouter() // 创建router实例

    this._router[method].apply(this._router, slice.call(arguments))

    return this
  }
})

app.use = function (fn) { // fn 有可能是路径组合成的数组，也有可能是middleware函数组成的数组
  let path = '/';
  let offset = 0; // 处理函数在参数类数组中的起始坐标

  if (typeof fn !== 'function') { // 有可能是数组或者字符串
    let arg = fn;
    /**
     * 这里就是fn可能是 [[[fn1], [fn2]], fn3]
     */
    while (Array.isArray(arg) && arg.length) {
      arg = [0];
    }

    if (typeof arg !== 'function') {
      offset = 1;
      path = fn;
    }
  }

  const fns = flatten(slice.call(arguments, offset));

  if (!fns.length) {
    throw new TypeError('app.use() requires a middleware function at least');
  }

  this.lazyRouter();
  const router = this._router;

  fns.forEach(fn => {
    router.use.call(router, path, fn)
  })

  return this
}

app.handleApp = function (req, res, callback) {
  const router = this._router;

  const done = callback || finalHandler(req, res);

  if (!router) { // 没有router实例，说明没有调用过app.use或者app[method]
    return done();
  }

  this._router.handleRouter(req, res, done);
}

app.listen = function () {
  const server = http.createServer(this);

  return server.listen.apply(server, arguments);
}

