
const Buffer = require('buffer');

module.exports = function (req, res) {

  return function (err) {
    let msg, status;

    if (err) { // 先简单默认状态500
      msg = err.stack;
      status = 500;
    } else { // 找不到资源404
      msg = 'Cant`t find resource in the current url';
      status = 404;
    }

    res.statusCode = status;
    res.statusMessage = msg;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Length', Buffer.byteLength(body, 'utf8'));

    if (req.method === 'HEAD') {
      res.end()
      return
    }

    res.end(msg, 'utf8')
  }
}