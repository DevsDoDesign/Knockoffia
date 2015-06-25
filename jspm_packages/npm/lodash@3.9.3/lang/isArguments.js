/* */ 
var isArrayLike = require("../internal/isArrayLike"),
    isObjectLike = require("../internal/isObjectLike");
var argsTag = '[object Arguments]';
var objectProto = Object.prototype;
var objToString = objectProto.toString;
function isArguments(value) {
  return isObjectLike(value) && isArrayLike(value) && objToString.call(value) == argsTag;
}
module.exports = isArguments;
