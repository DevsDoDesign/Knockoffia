/* */ 
var baseIsFunction = require("../internal/baseIsFunction"),
    getNative = require("../internal/getNative");
var funcTag = '[object Function]';
var objectProto = Object.prototype;
var objToString = objectProto.toString;
var Uint8Array = getNative(global, 'Uint8Array');
var isFunction = !(baseIsFunction(/x/) || (Uint8Array && !baseIsFunction(Uint8Array))) ? baseIsFunction : function(value) {
  return objToString.call(value) == funcTag;
};
module.exports = isFunction;
