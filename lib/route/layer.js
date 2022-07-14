const pathToRegexp = require('../utils/pathToRegexp');

function Layer (path, handler) {
  this.path = path;
  this.handler = handler;
  this.keys = []
  this.regexp = pathToRegexp(path, this.keys);
}

const proto = Layer.prototype;

proto.handle = function (req, res, next) {
  var fn = this.handler;

  if (fn.length > 3) { // 参数大于三
    return next();
  }

  try {
    fn(req, res, next);
  } catch (err) {
    next(err);
  }
}

proto.handleError = function (error, req, res, next) {
  var fn = this.handler;

  if (fn.length !== 4) { // 参数不是4个
    // not a standard error handler
    return next(error);
  }

  try {
    fn(error, req, res, next);
  } catch (err) {
    next(err);
  }
}


module.exports = Layer