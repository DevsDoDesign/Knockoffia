/* */ 
"format cjs";
"use strict";

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _types = require("../../../types");

var t = _interopRequireWildcard(_types);

function keepBlockHoist(node, nodes) {
  if (node._blockHoist) {
    for (var i = 0; i < nodes.length; i++) {
      nodes[i]._blockHoist = node._blockHoist;
    }
  }
}

var metadata = {
  group: "builtin-modules"
};

exports.metadata = metadata;
var visitor = {
  ImportDeclaration: function ImportDeclaration(node, parent, scope, file) {
    // flow type
    if (node.isType) return;

    var nodes = [];

    if (node.specifiers.length) {
      var _arr = node.specifiers;

      for (var _i = 0; _i < _arr.length; _i++) {
        var specifier = _arr[_i];
        file.moduleFormatter.importSpecifier(specifier, node, nodes, scope);
      }
    } else {
      file.moduleFormatter.importDeclaration(node, nodes, scope);
    }

    if (nodes.length === 1) {
      // inherit `_blockHoist` - this is for `_blockHoist` in File.prototype.addImport
      nodes[0]._blockHoist = node._blockHoist;
    }

    return nodes;
  },

  ExportAllDeclaration: function ExportAllDeclaration(node, parent, scope, file) {
    var nodes = [];
    file.moduleFormatter.exportAllDeclaration(node, nodes, scope);
    keepBlockHoist(node, nodes);
    return nodes;
  },

  ExportDefaultDeclaration: function ExportDefaultDeclaration(node, parent, scope, file) {
    var nodes = [];
    file.moduleFormatter.exportDeclaration(node, nodes, scope);
    keepBlockHoist(node, nodes);
    return nodes;
  },

  ExportNamedDeclaration: function ExportNamedDeclaration(node, parent, scope, file) {
    // flow type
    if (this.get("declaration").isTypeAlias()) return;

    var nodes = [];

    if (node.declaration) {
      // make sure variable exports have an initializer
      // this is done here to avoid duplicating it in the module formatters
      if (t.isVariableDeclaration(node.declaration)) {
        var declar = node.declaration.declarations[0];
        declar.init = declar.init || t.identifier("undefined");
      }

      file.moduleFormatter.exportDeclaration(node, nodes, scope);
    } else if (node.specifiers) {
      for (var i = 0; i < node.specifiers.length; i++) {
        file.moduleFormatter.exportSpecifier(node.specifiers[i], node, nodes, scope);
      }
    }

    keepBlockHoist(node, nodes);

    return nodes;
  }
};
exports.visitor = visitor;