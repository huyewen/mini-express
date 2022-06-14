module.exports = function flatten (array, result = []) {
  array.forEach(function (item) {
    if (Array.isArray(item)) {
      flatten(item, result);
    } else {
      result.push(item);
    }
  })

  return result;
}