const mixin = require('./mixin');
const methods = require('./methods');
const finalHandler = require('./finalHandler');
const flatten = require('./flatten');
const {
  slice,
  hasOwnProperty
} = require('./tool');


module.exports = {
  mixin,
  methods,
  slice,
  hasOwnProperty,
  finalHandler,
  flatten
}