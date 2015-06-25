/* */ 
'use strict';
var findDOMNode = require("./findDOMNode");
var focusNode = require("./focusNode");
var AutoFocusMixin = {componentDidMount: function() {
    if (this.props.autoFocus) {
      focusNode(findDOMNode(this));
    }
  }};
module.exports = AutoFocusMixin;
