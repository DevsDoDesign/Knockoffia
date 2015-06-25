/* */ 
var baseDifference = require("../internal/baseDifference"),
    baseFlatten = require("../internal/baseFlatten"),
    isArrayLike = require("../internal/isArrayLike"),
    restParam = require("../function/restParam");
var difference = restParam(function(array, values) {
  return isArrayLike(array) ? baseDifference(array, baseFlatten(values, false, true)) : [];
});
module.exports = difference;
