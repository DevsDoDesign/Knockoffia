/* */ 
var baseDifference = require("../internal/baseDifference"),
    baseUniq = require("../internal/baseUniq"),
    isArrayLike = require("../internal/isArrayLike");
function xor() {
  var index = -1,
      length = arguments.length;
  while (++index < length) {
    var array = arguments[index];
    if (isArrayLike(array)) {
      var result = result ? baseDifference(result, array).concat(baseDifference(array, result)) : array;
    }
  }
  return result ? baseUniq(result) : [];
}
module.exports = xor;
