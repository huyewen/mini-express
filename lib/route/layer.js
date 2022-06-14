
function Layer (path, handler) {
  this.path = path;
  this.handler = handler;
}

const proto = Layer.prototype;

proto.handleRequest = function (req, res, next) {
  this.handler(req, res, next);
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