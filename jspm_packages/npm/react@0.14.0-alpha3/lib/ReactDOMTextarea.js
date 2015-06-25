/* */ 
(function(process) {
  'use strict';
  var AutoFocusMixin = require("./AutoFocusMixin");
  var DOMPropertyOperations = require("./DOMPropertyOperations");
  var LinkedValueUtils = require("./LinkedValueUtils");
  var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
  var ReactClass = require("./ReactClass");
  var ReactElement = require("./ReactElement");
  var ReactUpdates = require("./ReactUpdates");
  var assign = require("./Object.assign");
  var findDOMNode = require("./findDOMNode");
  var invariant = require("./invariant");
  var warning = require("./warning");
  var textarea = ReactElement.createFactory('textarea');
  function forceUpdateIfMounted() {
    if (this.isMounted()) {
      this.forceUpdate();
    }
  }
  var ReactDOMTextarea = ReactClass.createClass({
    displayName: 'ReactDOMTextarea',
    tagName: 'TEXTAREA',
    mixins: [AutoFocusMixin, LinkedValueUtils.Mixin, ReactBrowserComponentMixin],
    getInitialState: function() {
      var defaultValue = this.props.defaultValue;
      var children = this.props.children;
      if (children != null) {
        if ('production' !== process.env.NODE_ENV) {
          'production' !== process.env.NODE_ENV ? warning(false, 'Use the `defaultValue` or `value` props instead of setting ' + 'children on <textarea>.') : undefined;
        }
        !(defaultValue == null) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'If you supply `defaultValue` on a <textarea>, do not pass children.') : invariant(false) : undefined;
        if (Array.isArray(children)) {
          !(children.length <= 1) ? 'production' !== process.env.NODE_ENV ? invariant(false, '<textarea> can only have at most one child.') : invariant(false) : undefined;
          children = children[0];
        }
        defaultValue = '' + children;
      }
      if (defaultValue == null) {
        defaultValue = '';
      }
      var value = LinkedValueUtils.getValue(this.props);
      return {initialValue: '' + (value != null ? value : defaultValue)};
    },
    render: function() {
      var props = assign({}, this.props);
      !(props.dangerouslySetInnerHTML == null) ? 'production' !== process.env.NODE_ENV ? invariant(false, '`dangerouslySetInnerHTML` does not make sense on <textarea>.') : invariant(false) : undefined;
      props.defaultValue = null;
      props.value = null;
      props.onChange = this._handleChange;
      return textarea(props, this.state.initialValue);
    },
    componentDidUpdate: function(prevProps, prevState, prevContext) {
      var value = LinkedValueUtils.getValue(this.props);
      if (value != null) {
        var rootNode = findDOMNode(this);
        DOMPropertyOperations.setValueForProperty(rootNode, 'value', '' + value);
      }
    },
    _handleChange: function(event) {
      var returnValue;
      var onChange = LinkedValueUtils.getOnChange(this.props);
      if (onChange) {
        returnValue = onChange.call(this, event);
      }
      ReactUpdates.asap(forceUpdateIfMounted, this);
      return returnValue;
    }
  });
  module.exports = ReactDOMTextarea;
})(require("process"));
