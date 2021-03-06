/* */ 
"format cjs";
"use strict";

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _messages = require("../../../messages");

var messages = _interopRequireWildcard(_messages);

var _types = require("../../../types");

var t = _interopRequireWildcard(_types);

var metadata = {
  group: "builtin-pre"
};

exports.metadata = metadata;
var visitor = {
  ForXStatement: function ForXStatement(node, parent, scope, file) {
    var left = node.left;
    if (t.isVariableDeclaration(left)) {
      var declar = left.declarations[0];
      if (declar.init) throw file.errorWithNode(declar, messages.get("noAssignmentsInForHead"));
    }
  },

  Property: function Property(node, parent, scope, file) {
    if (node.kind === "set") {
      var first = node.value.params[0];
      if (t.isRestElement(first)) {
        throw file.errorWithNode(first, messages.get("settersNoRest"));
      }
    }
  }
};
exports.visitor = visitor;