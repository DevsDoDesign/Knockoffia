/* */ 
var SetCache = require("./SetCache"),
    constant = require("../utility/constant"),
    getNative = require("./getNative");
var Set = getNative(global, 'Set');
var nativeCreate = getNative(Object, 'create');
var createCache = !(nativeCreate && Set) ? constant(null) : function(values) {
  return new SetCache(values);
};
module.exports = createCache;
