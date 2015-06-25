/* */ 
(function(process) {
  'use strict';
  var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
  var ReactChildren = require("./ReactChildren");
  var ReactClass = require("./ReactClass");
  var ReactDOMSelect = require("./ReactDOMSelect");
  var ReactElement = require("./ReactElement");
  var ReactPropTypes = require("./ReactPropTypes");
  var assign = require("./Object.assign");
  var warning = require("./warning");
  var option = ReactElement.createFactory('option');
  var valueContextKey = ReactDOMSelect.valueContextKey;
  var ReactDOMOption = ReactClass.createClass({
    displayName: 'ReactDOMOption',
    tagName: 'OPTION',
    mixins: [ReactBrowserComponentMixin],
    getInitialState: function() {
      return {selected: null};
    },
    contextTypes: (function() {
      var obj = {};
      obj[valueContextKey] = ReactPropTypes.any;
      return obj;
    })(),
    componentWillMount: function() {
      if ('production' !== process.env.NODE_ENV) {
        'production' !== process.env.NODE_ENV ? warning(this.props.selected == null, 'Use the `defaultValue` or `value` props on <select> instead of ' + 'setting `selected` on <option>.') : undefined;
      }
      var context = this.context;
      var selectValue = context[valueContextKey];
      if (selectValue != null) {
        var selected = false;
        if (Array.isArray(selectValue)) {
          for (var i = 0; i < selectValue.length; i++) {
            if ('' + selectValue[i] === '' + this.props.value) {
              selected = true;
              break;
            }
          }
        } else {
          selected = '' + selectValue === '' + this.props.value;
        }
        this.setState({selected: selected});
      }
    },
    render: function() {
      var props = this.props;
      if (this.state.selected != null) {
        props = assign({}, props, {selected: this.state.selected});
      }
      var content = '';
      ReactChildren.forEach(this.props.children, function(child) {
        if (child == null) {
          return ;
        }
        if (typeof child === 'string' || typeof child === 'number') {
          content += child;
        } else {
          'production' !== process.env.NODE_ENV ? warning(false, 'Only strings and numbers are supported as <option> children.') : undefined;
        }
      });
      return option(props, content);
    }
  });
  module.exports = ReactDOMOption;
})(require("process"));
