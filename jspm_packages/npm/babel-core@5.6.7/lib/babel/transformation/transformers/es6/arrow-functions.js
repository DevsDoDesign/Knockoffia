/* */ 
"format cjs";
"use strict";

exports.__esModule = true;
var visitor = {
  ArrowFunctionExpression: function ArrowFunctionExpression(node) {
    this.ensureBlock();
    node.expression = false;
    node.type = "FunctionExpression";
    node.shadow = true;
  }
};
exports.visitor = visitor;