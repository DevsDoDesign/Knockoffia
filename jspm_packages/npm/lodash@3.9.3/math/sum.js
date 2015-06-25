/* */ 
var arraySum = require("../internal/arraySum"),
    baseCallback = require("../internal/baseCallback"),
    baseSum = require("../internal/baseSum"),
    isArray = require("../lang/isArray"),
    isIterateeCall = require("../internal/isIterateeCall"),
    toIterable = require("../internal/toIterable");
function sum(collection, iteratee, thisArg) {
  if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
    iteratee = null;
  }
  var noIteratee = iteratee == null;
  iteratee = noIteratee ? iteratee : baseCallback(iteratee, thisArg, 3);
  return noIteratee ? arraySum(isArray(collection) ? collection : toIterable(collection)) : baseSum(collection, iteratee);
}
module.exports = sum;
