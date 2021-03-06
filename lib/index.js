var { mixin } = require('./utils');
var proto = require('./application');

exports = module.exports = function createApp () {
  var app = function (req, res, done) {
    app.handleApp(req, res, done);
  }

  mixin(app, proto, false);

  return app;
}
