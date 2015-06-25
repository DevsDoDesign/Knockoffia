/* */ 
var getNative = require("../internal/getNative");
var nativeIsFinite = global.isFinite,
    nativeNumIsFinite = getNative(Number, 'isFinite');
var isFinite = nativeNumIsFinite || function(value) {
  return typeof value == 'number' && nativeIsFinite(value);
};
module.exports = isFinite;
