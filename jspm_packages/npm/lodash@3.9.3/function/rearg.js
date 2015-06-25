/* */ 
var baseFlatten = require("../internal/baseFlatten"),
    createWrapper = require("../internal/createWrapper"),
    restParam = require("./restParam");
var REARG_FLAG = 256;
var rearg = restParam(function(func, indexes) {
  return createWrapper(func, REARG_FLAG, null, null, null, baseFlatten(indexes));
});
module.exports = rearg;
