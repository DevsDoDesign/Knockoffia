/* */ 
(function(process) {
  'use strict';
  var CSSPropertyOperations = require("./CSSPropertyOperations");
  var DOMProperty = require("./DOMProperty");
  var DOMPropertyOperations = require("./DOMPropertyOperations");
  var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");
  var ReactComponentBrowserEnvironment = require("./ReactComponentBrowserEnvironment");
  var ReactMount = require("./ReactMount");
  var ReactMultiChild = require("./ReactMultiChild");
  var ReactPerf = require("./ReactPerf");
  var assign = require("./Object.assign");
  var escapeTextContentForBrowser = require("./escapeTextContentForBrowser");
  var invariant = require("./invariant");
  var isEventSupported = require("./isEventSupported");
  var keyOf = require("./keyOf");
  var shallowEqual = require("./shallowEqual");
  var validateDOMNesting = require("./validateDOMNesting");
  var warning = require("./warning");
  var deleteListener = ReactBrowserEventEmitter.deleteListener;
  var listenTo = ReactBrowserEventEmitter.listenTo;
  var registrationNameModules = ReactBrowserEventEmitter.registrationNameModules;
  var CONTENT_TYPES = {
    'string': true,
    'number': true
  };
  var STYLE = keyOf({style: null});
  var ELEMENT_NODE_TYPE = 1;
  var styleMutationWarning = {};
  function checkAndWarnForMutatedStyle(style1, style2, component) {
    if (style1 == null || style2 == null) {
      return ;
    }
    if (shallowEqual(style1, style2)) {
      return ;
    }
    var componentName = component._tag;
    var owner = component._currentElement._owner;
    var ownerName;
    if (owner) {
      ownerName = owner.getName();
    }
    var hash = ownerName + '|' + componentName;
    if (styleMutationWarning.hasOwnProperty(hash)) {
      return ;
    }
    styleMutationWarning[hash] = true;
    'production' !== process.env.NODE_ENV ? warning(false, '`%s` was passed a style object that has previously been mutated. ' + 'Mutating `style` is deprecated. Consider cloning it beforehand. Check ' + 'the `render` %s. Previous style: %s. Mutated style: %s.', componentName, owner ? 'of `' + ownerName + '`' : 'using <' + componentName + '>', JSON.stringify(style1), JSON.stringify(style2)) : undefined;
  }
  var BackendIDOperations = null;
  function assertValidProps(component, props) {
    if (!props) {
      return ;
    }
    if ('production' !== process.env.NODE_ENV) {
      if (voidElementTags[component._tag]) {
        'production' !== process.env.NODE_ENV ? warning(props.children == null && props.dangerouslySetInnerHTML == null, '%s is a void element tag and must not have `children` or ' + 'use `props.dangerouslySetInnerHTML`.', component._tag) : undefined;
      }
    }
    if (props.dangerouslySetInnerHTML != null) {
      !(props.children == null) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'Can only set one of `children` or `props.dangerouslySetInnerHTML`.') : invariant(false) : undefined;
      !(typeof props.dangerouslySetInnerHTML === 'object' && '__html' in props.dangerouslySetInnerHTML) ? 'production' !== process.env.NODE_ENV ? invariant(false, '`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. ' + 'Please visit https://fb.me/react-invariant-dangerously-set-inner-html ' + 'for more information.') : invariant(false) : undefined;
    }
    if ('production' !== process.env.NODE_ENV) {
      'production' !== process.env.NODE_ENV ? warning(props.innerHTML == null, 'Directly setting property `innerHTML` is not permitted. ' + 'For more information, lookup documentation on `dangerouslySetInnerHTML`.') : undefined;
      'production' !== process.env.NODE_ENV ? warning(!props.contentEditable || props.children == null, 'A component is `contentEditable` and contains `children` managed by ' + 'React. It is now your responsibility to guarantee that none of ' + 'those nodes are unexpectedly modified or duplicated. This is ' + 'probably not intentional.') : undefined;
    }
    !(props.style == null || typeof props.style === 'object') ? 'production' !== process.env.NODE_ENV ? invariant(false, 'The `style` prop expects a mapping from style properties to values, ' + 'not a string. For example, style={{marginRight: spacing + \'em\'}} when ' + 'using JSX.') : invariant(false) : undefined;
  }
  function enqueuePutListener(id, registrationName, listener, transaction) {
    if ('production' !== process.env.NODE_ENV) {
      'production' !== process.env.NODE_ENV ? warning(registrationName !== 'onScroll' || isEventSupported('scroll', true), 'This browser doesn\'t support the `onScroll` event') : undefined;
    }
    var container = ReactMount.findReactContainerForID(id);
    if (container) {
      var doc = container.nodeType === ELEMENT_NODE_TYPE ? container.ownerDocument : container;
      listenTo(registrationName, doc);
    }
    transaction.getReactMountReady().enqueue(putListener, {
      id: id,
      registrationName: registrationName,
      listener: listener
    });
  }
  function putListener() {
    var listenerToPut = this;
    ReactBrowserEventEmitter.putListener(listenerToPut.id, listenerToPut.registrationName, listenerToPut.listener);
  }
  var omittedCloseTags = {
    'area': true,
    'base': true,
    'br': true,
    'col': true,
    'embed': true,
    'hr': true,
    'img': true,
    'input': true,
    'keygen': true,
    'link': true,
    'meta': true,
    'param': true,
    'source': true,
    'track': true,
    'wbr': true
  };
  var newlineEatingTags = {
    'listing': true,
    'pre': true,
    'textarea': true
  };
  var voidElementTags = assign({'menuitem': true}, omittedCloseTags);
  var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
  var validatedTagCache = {};
  var hasOwnProperty = ({}).hasOwnProperty;
  function validateDangerousTag(tag) {
    if (!hasOwnProperty.call(validatedTagCache, tag)) {
      !VALID_TAG_REGEX.test(tag) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'Invalid tag: %s', tag) : invariant(false) : undefined;
      validatedTagCache[tag] = true;
    }
  }
  function processChildContext(context, inst) {
    if ('production' !== process.env.NODE_ENV) {
      context = assign({}, context);
      var info = context[validateDOMNesting.ancestorInfoContextKey];
      context[validateDOMNesting.ancestorInfoContextKey] = validateDOMNesting.updatedAncestorInfo(info, inst._tag, inst);
    }
    return context;
  }
  function ReactDOMComponent(tag) {
    validateDangerousTag(tag);
    this._tag = tag;
    this._renderedChildren = null;
    this._previousStyle = null;
    this._previousStyleCopy = null;
    this._rootNodeID = null;
  }
  ReactDOMComponent.displayName = 'ReactDOMComponent';
  ReactDOMComponent.Mixin = {
    construct: function(element) {
      this._currentElement = element;
    },
    mountComponent: function(rootID, transaction, context) {
      this._rootNodeID = rootID;
      assertValidProps(this, this._currentElement.props);
      if ('production' !== process.env.NODE_ENV) {
        if (context[validateDOMNesting.ancestorInfoContextKey]) {
          validateDOMNesting(this._tag, this, context[validateDOMNesting.ancestorInfoContextKey]);
        }
      }
      var tagOpen = this._createOpenTagMarkupAndPutListeners(transaction);
      var tagContent = this._createContentMarkup(transaction, context);
      if (!tagContent && omittedCloseTags[this._tag]) {
        return tagOpen + '/>';
      }
      return tagOpen + '>' + tagContent + '</' + this._tag + '>';
    },
    _createOpenTagMarkupAndPutListeners: function(transaction) {
      var props = this._currentElement.props;
      var ret = '<' + this._tag;
      for (var propKey in props) {
        if (!props.hasOwnProperty(propKey)) {
          continue;
        }
        var propValue = props[propKey];
        if (propValue == null) {
          continue;
        }
        if (registrationNameModules.hasOwnProperty(propKey)) {
          enqueuePutListener(this._rootNodeID, propKey, propValue, transaction);
        } else {
          if (propKey === STYLE) {
            if (propValue) {
              if ('production' !== process.env.NODE_ENV) {
                this._previousStyle = propValue;
              }
              propValue = this._previousStyleCopy = assign({}, props.style);
            }
            propValue = CSSPropertyOperations.createMarkupForStyles(propValue);
          }
          var markup = DOMPropertyOperations.createMarkupForProperty(propKey, propValue);
          if (markup) {
            ret += ' ' + markup;
          }
        }
      }
      if (transaction.renderToStaticMarkup) {
        return ret;
      }
      var markupForID = DOMPropertyOperations.createMarkupForID(this._rootNodeID);
      return ret + ' ' + markupForID;
    },
    _createContentMarkup: function(transaction, context) {
      var ret = '';
      var props = this._currentElement.props;
      var innerHTML = props.dangerouslySetInnerHTML;
      if (innerHTML != null) {
        if (innerHTML.__html != null) {
          ret = innerHTML.__html;
        }
      } else {
        var contentToUse = CONTENT_TYPES[typeof props.children] ? props.children : null;
        var childrenToUse = contentToUse != null ? null : props.children;
        if (contentToUse != null) {
          ret = escapeTextContentForBrowser(contentToUse);
        } else if (childrenToUse != null) {
          var mountImages = this.mountChildren(childrenToUse, transaction, processChildContext(context, this));
          ret = mountImages.join('');
        }
      }
      if (newlineEatingTags[this._tag] && ret.charAt(0) === '\n') {
        return '\n' + ret;
      } else {
        return ret;
      }
    },
    receiveComponent: function(nextElement, transaction, context) {
      var prevElement = this._currentElement;
      this._currentElement = nextElement;
      this.updateComponent(transaction, prevElement, nextElement, context);
    },
    updateComponent: function(transaction, prevElement, nextElement, context) {
      assertValidProps(this, this._currentElement.props);
      this._updateDOMProperties(prevElement.props, transaction);
      this._updateDOMChildren(prevElement.props, transaction, processChildContext(context, this));
    },
    _updateDOMProperties: function(lastProps, transaction) {
      var nextProps = this._currentElement.props;
      var propKey;
      var styleName;
      var styleUpdates;
      for (propKey in lastProps) {
        if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey)) {
          continue;
        }
        if (propKey === STYLE) {
          var lastStyle = this._previousStyleCopy;
          for (styleName in lastStyle) {
            if (lastStyle.hasOwnProperty(styleName)) {
              styleUpdates = styleUpdates || {};
              styleUpdates[styleName] = '';
            }
          }
          this._previousStyleCopy = null;
        } else if (registrationNameModules.hasOwnProperty(propKey)) {
          if (lastProps[propKey]) {
            deleteListener(this._rootNodeID, propKey);
          }
        } else if (DOMProperty.isStandardName[propKey] || DOMProperty.isCustomAttribute(propKey)) {
          BackendIDOperations.deletePropertyByID(this._rootNodeID, propKey);
        }
      }
      for (propKey in nextProps) {
        var nextProp = nextProps[propKey];
        var lastProp = propKey === STYLE ? this._previousStyleCopy : lastProps[propKey];
        if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp) {
          continue;
        }
        if (propKey === STYLE) {
          if (nextProp) {
            if ('production' !== process.env.NODE_ENV) {
              checkAndWarnForMutatedStyle(this._previousStyleCopy, this._previousStyle, this);
              this._previousStyle = nextProp;
            }
            nextProp = this._previousStyleCopy = assign({}, nextProp);
          } else {
            this._previousStyleCopy = null;
          }
          if (lastProp) {
            for (styleName in lastProp) {
              if (lastProp.hasOwnProperty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
                styleUpdates = styleUpdates || {};
                styleUpdates[styleName] = '';
              }
            }
            for (styleName in nextProp) {
              if (nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== nextProp[styleName]) {
                styleUpdates = styleUpdates || {};
                styleUpdates[styleName] = nextProp[styleName];
              }
            }
          } else {
            styleUpdates = nextProp;
          }
        } else if (registrationNameModules.hasOwnProperty(propKey)) {
          if (nextProp) {
            enqueuePutListener(this._rootNodeID, propKey, nextProp, transaction);
          } else if (lastProp) {
            deleteListener(this._rootNodeID, propKey);
          }
        } else if (DOMProperty.isStandardName[propKey] || DOMProperty.isCustomAttribute(propKey)) {
          BackendIDOperations.updatePropertyByID(this._rootNodeID, propKey, nextProp);
        }
      }
      if (styleUpdates) {
        BackendIDOperations.updateStylesByID(this._rootNodeID, styleUpdates);
      }
    },
    _updateDOMChildren: function(lastProps, transaction, context) {
      var nextProps = this._currentElement.props;
      var lastContent = CONTENT_TYPES[typeof lastProps.children] ? lastProps.children : null;
      var nextContent = CONTENT_TYPES[typeof nextProps.children] ? nextProps.children : null;
      var lastHtml = lastProps.dangerouslySetInnerHTML && lastProps.dangerouslySetInnerHTML.__html;
      var nextHtml = nextProps.dangerouslySetInnerHTML && nextProps.dangerouslySetInnerHTML.__html;
      var lastChildren = lastContent != null ? null : lastProps.children;
      var nextChildren = nextContent != null ? null : nextProps.children;
      var lastHasContentOrHtml = lastContent != null || lastHtml != null;
      var nextHasContentOrHtml = nextContent != null || nextHtml != null;
      if (lastChildren != null && nextChildren == null) {
        this.updateChildren(null, transaction, context);
      } else if (lastHasContentOrHtml && !nextHasContentOrHtml) {
        this.updateTextContent('');
      }
      if (nextContent != null) {
        if (lastContent !== nextContent) {
          this.updateTextContent('' + nextContent);
        }
      } else if (nextHtml != null) {
        if (lastHtml !== nextHtml) {
          BackendIDOperations.updateInnerHTMLByID(this._rootNodeID, nextHtml);
        }
      } else if (nextChildren != null) {
        this.updateChildren(nextChildren, transaction, context);
      }
    },
    unmountComponent: function() {
      this.unmountChildren();
      ReactBrowserEventEmitter.deleteAllListeners(this._rootNodeID);
      ReactComponentBrowserEnvironment.unmountIDFromEnvironment(this._rootNodeID);
      this._rootNodeID = null;
    }
  };
  ReactPerf.measureMethods(ReactDOMComponent, 'ReactDOMComponent', {
    mountComponent: 'mountComponent',
    updateComponent: 'updateComponent'
  });
  assign(ReactDOMComponent.prototype, ReactDOMComponent.Mixin, ReactMultiChild.Mixin);
  ReactDOMComponent.injection = {injectIDOperations: function(IDOperations) {
      ReactDOMComponent.BackendIDOperations = BackendIDOperations = IDOperations;
    }};
  module.exports = ReactDOMComponent;
})(require("process"));
