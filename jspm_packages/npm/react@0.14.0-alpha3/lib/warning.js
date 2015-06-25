/* */ 
(function(process) {
  'use strict';
  var emptyFunction = require("./emptyFunction");
  var warning = emptyFunction;
  if ('production' !== process.env.NODE_ENV) {
    warning = function(condition, format) {
      for (var _len = arguments.length,
          args = Array(_len > 2 ? _len - 2 : 0),
          _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
      if (format === undefined) {
        throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
      }
      if (format.length < 10 || /^[s\W]*$/.test(format)) {
        throw new Error('The warning format should be able to uniquely identify this ' + 'warning. Please, use a more descriptive format than: ' + format);
      }
      if (format.indexOf('Failed Composite propType: ') === 0) {
        return ;
      }
      if (!condition) {
        var argIndex = 0;
        var message = 'Warning: ' + format.replace(/%s/g, function() {
          return args[argIndex++];
        });
        if (typeof console !== 'undefined') {
          console.error(message);
        }
        try {
          throw new Error(message);
        } catch (x) {}
      }
    };
  }
  module.exports = warning;
})(require("process"));
