/* */ 
(function(process) {
  var Buffer = require("../../../buffer@3.2.2").Buffer;
  if (process.env.OBJECT_IMPL)
    Buffer.TYPED_ARRAY_SUPPORT = false;
  var common = {};
  var assert = require("assert");
  assert.throws(function() {
    new Buffer(0x3fffffff + 1);
  }, RangeError);
})(require("process"));
