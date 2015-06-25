/* */ 
var assign = require("./assign"),
    assignDefaults = require("../internal/assignDefaults"),
    restParam = require("../function/restParam");
var defaults = restParam(function(args) {
  var object = args[0];
  if (object == null) {
    return object;
  }
  args.push(assignDefaults);
  return assign.apply(undefined, args);
});
module.exports = defaults;
