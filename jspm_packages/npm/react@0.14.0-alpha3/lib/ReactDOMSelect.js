/* */ 
'use strict';
var AutoFocusMixin = require("./AutoFocusMixin");
var LinkedValueUtils = require("./LinkedValueUtils");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactClass = require("./ReactClass");
var ReactElement = require("./ReactElement");
var ReactUpdates = require("./ReactUpdates");
var ReactPropTypes = require("./ReactPropTypes");
var assign = require("./Object.assign");
var findDOMNode = require("./findDOMNode");
var select = ReactElement.createFactory('select');
var valueContextKey = '__ReactDOMSelect_value$' + Math.random().toString(36).slice(2);
function updateOptionsIfPendingUpdateAndMounted() {
  if (this._pendingUpdate) {
    this._pendingUpdate = false;
    var value = LinkedValueUtils.getValue(this.props);
    if (value != null && this.isMounted()) {
      updateOptions(this, value);
    }
  }
}
function selectValueType(props, propName, componentName) {
  if (props[propName] == null) {
    return null;
  }
  if (props.multiple) {
    if (!Array.isArray(props[propName])) {
      return new Error('The `' + propName + '` prop supplied to <select> must be an array if ' + '`multiple` is true.');
    }
  } else {
    if (Array.isArray(props[propName])) {
      return new Error('The `' + propName + '` prop supplied to <select> must be a scalar ' + 'value if `multiple` is false.');
    }
  }
}
function updateOptions(component, propValue) {
  var selectedValue,
      i;
  var options = findDOMNode(component).options;
  if (component.props.multiple) {
    selectedValue = {};
    for (i = 0; i < propValue.length; i++) {
      selectedValue['' + propValue[i]] = true;
    }
    for (i = 0; i < options.length; i++) {
      var selected = selectedValue.hasOwnProperty(options[i].value);
      if (options[i].selected !== selected) {
        options[i].selected = selected;
      }
    }
  } else {
    selectedValue = '' + propValue;
    for (i = 0; i < options.length; i++) {
      if (options[i].value === selectedValue) {
        options[i].selected = true;
        return ;
      }
    }
    if (options.length) {
      options[0].selected = true;
    }
  }
}
var ReactDOMSelect = ReactClass.createClass({
  displayName: 'ReactDOMSelect',
  tagName: 'SELECT',
  mixins: [AutoFocusMixin, LinkedValueUtils.Mixin, ReactBrowserComponentMixin],
  statics: {valueContextKey: valueContextKey},
  propTypes: {
    defaultValue: selectValueType,
    value: selectValueType
  },
  getInitialState: function() {
    var value = LinkedValueUtils.getValue(this.props);
    if (value != null) {
      return {initialValue: value};
    } else {
      return {initialValue: this.props.defaultValue};
    }
  },
  childContextTypes: (function() {
    var obj = {};
    obj[valueContextKey] = ReactPropTypes.any;
    return obj;
  })(),
  getChildContext: function() {
    var obj = {};
    obj[valueContextKey] = this.state.initialValue;
    return obj;
  },
  render: function() {
    var props = assign({}, this.props);
    props.onChange = this._handleChange;
    props.value = null;
    return select(props, this.props.children);
  },
  componentWillMount: function() {
    this._pendingUpdate = false;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({initialValue: null});
  },
  componentDidUpdate: function(prevProps) {
    var value = LinkedValueUtils.getValue(this.props);
    if (value != null) {
      this._pendingUpdate = false;
      updateOptions(this, value);
    } else if (!prevProps.multiple !== !this.props.multiple) {
      if (this.props.defaultValue != null) {
        updateOptions(this, this.props.defaultValue);
      } else {
        updateOptions(this, this.props.multiple ? [] : '');
      }
    }
  },
  _handleChange: function(event) {
    var returnValue;
    var onChange = LinkedValueUtils.getOnChange(this.props);
    if (onChange) {
      returnValue = onChange.call(this, event);
    }
    this._pendingUpdate = true;
    ReactUpdates.asap(updateOptionsIfPendingUpdateAndMounted, this);
    return returnValue;
  }
});
module.exports = ReactDOMSelect;
