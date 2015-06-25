/* */ 
var arrayExtremum = require("./arrayExtremum"),
    baseCallback = require("./baseCallback"),
    baseExtremum = require("./baseExtremum"),
    isIterateeCall = require("./isIterateeCall"),
    toIterable = require("./toIterable");
function createExtremum(comparator, exValue) {
  return function(collection, iteratee, thisArg) {
    if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
      iteratee = null;
    }
    iteratee = baseCallback(iteratee, thisArg, 3);
    if (iteratee.length == 1) {
      collection = toIterable(collection);
      var result = arrayExtremum(collection, iteratee, comparator, exValue);
      if (!(collection.length && result === exValue)) {
        return result;
      }
    }
    return baseExtremum(collection, iteratee, comparator, exValue);
  };
}
module.exports = createExtremum;
