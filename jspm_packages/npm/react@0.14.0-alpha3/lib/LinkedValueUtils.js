/* */ 
(function(process) {
  'use strict';
  var ReactPropTypes = require("./ReactPropTypes");
  var invariant = require("./invariant");
  var hasReadOnlyValue = {
    'button': true,
    'checkbox': true,
    'image': true,
    'hidden': true,
    'radio': true,
    'reset': true,
    'submit': true
  };
  function _assertSingleLink(inputProps) {
    !(inputProps.checkedLink == null || inputProps.valueLink == null) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'Cannot provide a checkedLink and a valueLink. If you want to use ' + 'checkedLink, you probably don\'t want to use valueLink and vice versa.') : invariant(false) : undefined;
  }
  function _assertValueLink(inputProps) {
    _assertSingleLink(inputProps);
    !(inputProps.value == null && inputProps.onChange == null) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'Cannot provide a valueLink and a value or onChange event. If you want ' + 'to use value or onChange, you probably don\'t want to use valueLink.') : invariant(false) : undefined;
  }
  function _assertCheckedLink(inputProps) {
    _assertSingleLink(inputProps);
    !(inputProps.checked == null && inputProps.onChange == null) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'Cannot provide a checkedLink and a checked property or onChange event. ' + 'If you want to use checked or onChange, you probably don\'t want to ' + 'use checkedLink') : invariant(false) : undefined;
  }
  function _handleLinkedValueChange(e) {
    this.props.valueLink.requestChange(e.target.value);
  }
  function _handleLinkedCheckChange(e) {
    this.props.checkedLink.requestChange(e.target.checked);
  }
  var LinkedValueUtils = {
    Mixin: {propTypes: {
        value: function(props, propName, componentName) {
          if (!props[propName] || hasReadOnlyValue[props.type] || props.onChange || props.readOnly || props.disabled) {
            return null;
          }
          return new Error('You provided a `value` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultValue`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
        },
        checked: function(props, propName, componentName) {
          if (!props[propName] || props.onChange || props.readOnly || props.disabled) {
            return null;
          }
          return new Error('You provided a `checked` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultChecked`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
        },
        onChange: ReactPropTypes.func
      }},
    getValue: function(inputProps) {
      if (inputProps.valueLink) {
        _assertValueLink(inputProps);
        return inputProps.valueLink.value;
      }
      return inputProps.value;
    },
    getChecked: function(inputProps) {
      if (inputProps.checkedLink) {
        _assertCheckedLink(inputProps);
        return inputProps.checkedLink.value;
      }
      return inputProps.checked;
    },
    getOnChange: function(inputProps) {
      if (inputProps.valueLink) {
        _assertValueLink(inputProps);
        return _handleLinkedValueChange;
      } else if (inputProps.checkedLink) {
        _assertCheckedLink(inputProps);
        return _handleLinkedCheckChange;
      }
      return inputProps.onChange;
    }
  };
  module.exports = LinkedValueUtils;
})(require("process"));
