/* */ 
(function(process) {
  'use strict';
  var ReactComponentEnvironment = require("./ReactComponentEnvironment");
  var ReactContext = require("./ReactContext");
  var ReactCurrentOwner = require("./ReactCurrentOwner");
  var ReactElement = require("./ReactElement");
  var ReactElementValidator = require("./ReactElementValidator");
  var ReactInstanceMap = require("./ReactInstanceMap");
  var ReactLifeCycle = require("./ReactLifeCycle");
  var ReactNativeComponent = require("./ReactNativeComponent");
  var ReactPerf = require("./ReactPerf");
  var ReactPropTypeLocations = require("./ReactPropTypeLocations");
  var ReactPropTypeLocationNames = require("./ReactPropTypeLocationNames");
  var ReactReconciler = require("./ReactReconciler");
  var ReactUpdates = require("./ReactUpdates");
  var assign = require("./Object.assign");
  var emptyObject = require("./emptyObject");
  var invariant = require("./invariant");
  var shouldUpdateReactComponent = require("./shouldUpdateReactComponent");
  var warning = require("./warning");
  function getDeclarationErrorAddendum(component) {
    var owner = component._currentElement._owner || null;
    if (owner) {
      var name = owner.getName();
      if (name) {
        return ' Check the render method of `' + name + '`.';
      }
    }
    return '';
  }
  var nextMountID = 1;
  var ReactCompositeComponentMixin = {
    construct: function(element) {
      this._currentElement = element;
      this._rootNodeID = null;
      this._instance = null;
      this._pendingElement = null;
      this._pendingStateQueue = null;
      this._pendingReplaceState = false;
      this._pendingForceUpdate = false;
      this._renderedComponent = null;
      this._context = null;
      this._mountOrder = 0;
      this._isTopLevel = false;
      this._pendingCallbacks = null;
    },
    mountComponent: function(rootID, transaction, context) {
      this._context = context;
      this._mountOrder = nextMountID++;
      this._rootNodeID = rootID;
      var publicProps = this._processProps(this._currentElement.props);
      var publicContext = this._processContext(context);
      var Component = ReactNativeComponent.getComponentClassForElement(this._currentElement);
      var inst = new Component(publicProps, publicContext);
      if ('production' !== process.env.NODE_ENV) {
        'production' !== process.env.NODE_ENV ? warning(inst.render != null, '%s(...): No `render` method found on the returned component ' + 'instance: you may have forgotten to define `render` in your ' + 'component or you may have accidentally tried to render an element ' + 'whose type is a function that isn\'t a React component.', Component.displayName || Component.name || 'Component') : undefined;
      }
      inst.props = publicProps;
      inst.context = publicContext;
      inst.refs = emptyObject;
      this._instance = inst;
      ReactInstanceMap.set(inst, this);
      if ('production' !== process.env.NODE_ENV) {
        'production' !== process.env.NODE_ENV ? warning(!inst.getInitialState || inst.getInitialState.isReactClassApproved, 'getInitialState was defined on %s, a plain JavaScript class. ' + 'This is only supported for classes created using React.createClass. ' + 'Did you mean to define a state property instead?', this.getName() || 'a component') : undefined;
        'production' !== process.env.NODE_ENV ? warning(!inst.getDefaultProps || inst.getDefaultProps.isReactClassApproved, 'getDefaultProps was defined on %s, a plain JavaScript class. ' + 'This is only supported for classes created using React.createClass. ' + 'Use a static property to define defaultProps instead.', this.getName() || 'a component') : undefined;
        'production' !== process.env.NODE_ENV ? warning(!inst.propTypes, 'propTypes was defined as an instance property on %s. Use a static ' + 'property to define propTypes instead.', this.getName() || 'a component') : undefined;
        'production' !== process.env.NODE_ENV ? warning(!inst.contextTypes, 'contextTypes was defined as an instance property on %s. Use a ' + 'static property to define contextTypes instead.', this.getName() || 'a component') : undefined;
        'production' !== process.env.NODE_ENV ? warning(typeof inst.componentShouldUpdate !== 'function', '%s has a method called ' + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' + 'The name is phrased as a question because the function is ' + 'expected to return a value.', this.getName() || 'A component') : undefined;
      }
      var initialState = inst.state;
      if (initialState === undefined) {
        inst.state = initialState = null;
      }
      !(typeof initialState === 'object' && !Array.isArray(initialState)) ? 'production' !== process.env.NODE_ENV ? invariant(false, '%s.state: must be set to an object or null', this.getName() || 'ReactCompositeComponent') : invariant(false) : undefined;
      this._pendingStateQueue = null;
      this._pendingReplaceState = false;
      this._pendingForceUpdate = false;
      var renderedElement;
      var previouslyMounting = ReactLifeCycle.currentlyMountingInstance;
      ReactLifeCycle.currentlyMountingInstance = this;
      try {
        if (inst.componentWillMount) {
          inst.componentWillMount();
          if (this._pendingStateQueue) {
            inst.state = this._processPendingState(inst.props, inst.context);
          }
        }
        renderedElement = this._renderValidatedComponent();
      } finally {
        ReactLifeCycle.currentlyMountingInstance = previouslyMounting;
      }
      this._renderedComponent = this._instantiateReactComponent(renderedElement, this._currentElement.type);
      var markup = ReactReconciler.mountComponent(this._renderedComponent, rootID, transaction, this._processChildContext(context));
      if (inst.componentDidMount) {
        transaction.getReactMountReady().enqueue(inst.componentDidMount, inst);
      }
      return markup;
    },
    unmountComponent: function() {
      var inst = this._instance;
      if (inst.componentWillUnmount) {
        var previouslyUnmounting = ReactLifeCycle.currentlyUnmountingInstance;
        ReactLifeCycle.currentlyUnmountingInstance = this;
        try {
          inst.componentWillUnmount();
        } finally {
          ReactLifeCycle.currentlyUnmountingInstance = previouslyUnmounting;
        }
      }
      ReactReconciler.unmountComponent(this._renderedComponent);
      this._renderedComponent = null;
      this._pendingStateQueue = null;
      this._pendingReplaceState = false;
      this._pendingForceUpdate = false;
      this._pendingCallbacks = null;
      this._pendingElement = null;
      this._context = null;
      this._rootNodeID = null;
      ReactInstanceMap.remove(inst);
    },
    _setPropsInternal: function(partialProps, callback) {
      var element = this._pendingElement || this._currentElement;
      this._pendingElement = ReactElement.cloneAndReplaceProps(element, assign({}, element.props, partialProps));
      ReactUpdates.enqueueUpdate(this, callback);
    },
    _maskContext: function(context) {
      var maskedContext = null;
      var Component = ReactNativeComponent.getComponentClassForElement(this._currentElement);
      var contextTypes = Component.contextTypes;
      if (!contextTypes) {
        return emptyObject;
      }
      maskedContext = {};
      for (var contextName in contextTypes) {
        maskedContext[contextName] = context[contextName];
      }
      return maskedContext;
    },
    _processContext: function(context) {
      var maskedContext = this._maskContext(context);
      if ('production' !== process.env.NODE_ENV) {
        var Component = ReactNativeComponent.getComponentClassForElement(this._currentElement);
        if (Component.contextTypes) {
          this._checkPropTypes(Component.contextTypes, maskedContext, ReactPropTypeLocations.context);
        }
      }
      return maskedContext;
    },
    _processChildContext: function(currentContext) {
      var inst = this._instance;
      var childContext = inst.getChildContext && inst.getChildContext();
      if (childContext) {
        !(typeof inst.constructor.childContextTypes === 'object') ? 'production' !== process.env.NODE_ENV ? invariant(false, '%s.getChildContext(): childContextTypes must be defined in order to ' + 'use getChildContext().', this.getName() || 'ReactCompositeComponent') : invariant(false) : undefined;
        if ('production' !== process.env.NODE_ENV) {
          this._checkPropTypes(inst.constructor.childContextTypes, childContext, ReactPropTypeLocations.childContext);
        }
        for (var name in childContext) {
          !(name in inst.constructor.childContextTypes) ? 'production' !== process.env.NODE_ENV ? invariant(false, '%s.getChildContext(): key "%s" is not defined in childContextTypes.', this.getName() || 'ReactCompositeComponent', name) : invariant(false) : undefined;
        }
        return assign({}, currentContext, childContext);
      }
      return currentContext;
    },
    _processProps: function(newProps) {
      if ('production' !== process.env.NODE_ENV) {
        var Component = ReactNativeComponent.getComponentClassForElement(this._currentElement);
        if (Component.propTypes) {
          this._checkPropTypes(Component.propTypes, newProps, ReactPropTypeLocations.prop);
        }
      }
      return newProps;
    },
    _checkPropTypes: function(propTypes, props, location) {
      var componentName = this.getName();
      for (var propName in propTypes) {
        if (propTypes.hasOwnProperty(propName)) {
          var error;
          try {
            !(typeof propTypes[propName] === 'function') ? 'production' !== process.env.NODE_ENV ? invariant(false, '%s: %s type `%s` is invalid; it must be a function, usually ' + 'from React.PropTypes.', componentName || 'React class', ReactPropTypeLocationNames[location], propName) : invariant(false) : undefined;
            error = propTypes[propName](props, propName, componentName, location);
          } catch (ex) {
            error = ex;
          }
          if (error instanceof Error) {
            var addendum = getDeclarationErrorAddendum(this);
            if (location === ReactPropTypeLocations.prop) {
              'production' !== process.env.NODE_ENV ? warning(false, 'Failed Composite propType: %s%s', error.message, addendum) : undefined;
            } else {
              'production' !== process.env.NODE_ENV ? warning(false, 'Failed Context Types: %s%s', error.message, addendum) : undefined;
            }
          }
        }
      }
    },
    receiveComponent: function(nextElement, transaction, nextContext) {
      var prevElement = this._currentElement;
      var prevContext = this._context;
      this._pendingElement = null;
      this.updateComponent(transaction, prevElement, nextElement, prevContext, nextContext);
    },
    performUpdateIfNecessary: function(transaction) {
      if (this._pendingElement != null) {
        ReactReconciler.receiveComponent(this, this._pendingElement || this._currentElement, transaction, this._context);
      }
      if (this._pendingStateQueue !== null || this._pendingForceUpdate) {
        if ('production' !== process.env.NODE_ENV) {
          ReactElementValidator.checkAndWarnForMutatedProps(this._currentElement);
        }
        this.updateComponent(transaction, this._currentElement, this._currentElement, this._context, this._context);
      }
    },
    updateComponent: function(transaction, prevParentElement, nextParentElement, prevUnmaskedContext, nextUnmaskedContext) {
      var inst = this._instance;
      var nextContext = inst.context;
      var nextProps = inst.props;
      if (prevParentElement !== nextParentElement) {
        nextContext = this._processContext(nextUnmaskedContext);
        nextProps = this._processProps(nextParentElement.props);
        if (inst.componentWillReceiveProps) {
          inst.componentWillReceiveProps(nextProps, nextContext);
        }
      }
      var nextState = this._processPendingState(nextProps, nextContext);
      var shouldUpdate = this._pendingForceUpdate || !inst.shouldComponentUpdate || inst.shouldComponentUpdate(nextProps, nextState, nextContext);
      if ('production' !== process.env.NODE_ENV) {
        'production' !== process.env.NODE_ENV ? warning(typeof shouldUpdate !== 'undefined', '%s.shouldComponentUpdate(): Returned undefined instead of a ' + 'boolean value. Make sure to return true or false.', this.getName() || 'ReactCompositeComponent') : undefined;
      }
      if (shouldUpdate) {
        this._pendingForceUpdate = false;
        this._performComponentUpdate(nextParentElement, nextProps, nextState, nextContext, transaction, nextUnmaskedContext);
      } else {
        this._currentElement = nextParentElement;
        this._context = nextUnmaskedContext;
        inst.props = nextProps;
        inst.state = nextState;
        inst.context = nextContext;
      }
    },
    _processPendingState: function(props, context) {
      var inst = this._instance;
      var queue = this._pendingStateQueue;
      var replace = this._pendingReplaceState;
      this._pendingReplaceState = false;
      this._pendingStateQueue = null;
      if (!queue) {
        return inst.state;
      }
      if (replace && queue.length === 1) {
        return queue[0];
      }
      var nextState = assign({}, replace ? queue[0] : inst.state);
      for (var i = replace ? 1 : 0; i < queue.length; i++) {
        var partial = queue[i];
        assign(nextState, typeof partial === 'function' ? partial.call(inst, nextState, props, context) : partial);
      }
      return nextState;
    },
    _performComponentUpdate: function(nextElement, nextProps, nextState, nextContext, transaction, unmaskedContext) {
      var inst = this._instance;
      var prevProps = inst.props;
      var prevState = inst.state;
      var prevContext = inst.context;
      if (inst.componentWillUpdate) {
        inst.componentWillUpdate(nextProps, nextState, nextContext);
      }
      this._currentElement = nextElement;
      this._context = unmaskedContext;
      inst.props = nextProps;
      inst.state = nextState;
      inst.context = nextContext;
      this._updateRenderedComponent(transaction, unmaskedContext);
      if (inst.componentDidUpdate) {
        transaction.getReactMountReady().enqueue(inst.componentDidUpdate.bind(inst, prevProps, prevState, prevContext), inst);
      }
    },
    _updateRenderedComponent: function(transaction, context) {
      var prevComponentInstance = this._renderedComponent;
      var prevRenderedElement = prevComponentInstance._currentElement;
      var nextRenderedElement = this._renderValidatedComponent();
      if (shouldUpdateReactComponent(prevRenderedElement, nextRenderedElement)) {
        ReactReconciler.receiveComponent(prevComponentInstance, nextRenderedElement, transaction, this._processChildContext(context));
      } else {
        var thisID = this._rootNodeID;
        var prevComponentID = prevComponentInstance._rootNodeID;
        ReactReconciler.unmountComponent(prevComponentInstance);
        this._renderedComponent = this._instantiateReactComponent(nextRenderedElement, this._currentElement.type);
        var nextMarkup = ReactReconciler.mountComponent(this._renderedComponent, thisID, transaction, this._processChildContext(context));
        this._replaceNodeWithMarkupByID(prevComponentID, nextMarkup);
      }
    },
    _replaceNodeWithMarkupByID: function(prevComponentID, nextMarkup) {
      ReactComponentEnvironment.replaceNodeWithMarkupByID(prevComponentID, nextMarkup);
    },
    _renderValidatedComponentWithoutOwnerOrContext: function() {
      var inst = this._instance;
      var renderedComponent = inst.render();
      if ('production' !== process.env.NODE_ENV) {
        if (typeof renderedComponent === 'undefined' && inst.render._isMockFunction) {
          renderedComponent = null;
        }
      }
      return renderedComponent;
    },
    _renderValidatedComponent: function() {
      var renderedComponent;
      var previousContext = ReactContext.current;
      ReactContext.current = this._processChildContext(this._currentElement._context);
      ReactCurrentOwner.current = this;
      try {
        renderedComponent = this._renderValidatedComponentWithoutOwnerOrContext();
      } finally {
        ReactContext.current = previousContext;
        ReactCurrentOwner.current = null;
      }
      !((renderedComponent === null || renderedComponent === false || ReactElement.isValidElement(renderedComponent))) ? 'production' !== process.env.NODE_ENV ? invariant(false, '%s.render(): A valid ReactComponent must be returned. You may have ' + 'returned undefined, an array or some other invalid object.', this.getName() || 'ReactCompositeComponent') : invariant(false) : undefined;
      return renderedComponent;
    },
    attachRef: function(ref, component) {
      var inst = this.getPublicInstance();
      var refs = inst.refs === emptyObject ? inst.refs = {} : inst.refs;
      refs[ref] = component.getPublicInstance();
    },
    detachRef: function(ref) {
      var refs = this.getPublicInstance().refs;
      delete refs[ref];
    },
    getName: function() {
      var type = this._currentElement.type;
      var constructor = this._instance && this._instance.constructor;
      return type.displayName || constructor && constructor.displayName || type.name || constructor && constructor.name || null;
    },
    getPublicInstance: function() {
      return this._instance;
    },
    _instantiateReactComponent: null
  };
  ReactPerf.measureMethods(ReactCompositeComponentMixin, 'ReactCompositeComponent', {
    mountComponent: 'mountComponent',
    updateComponent: 'updateComponent',
    _renderValidatedComponent: '_renderValidatedComponent'
  });
  var ReactCompositeComponent = {Mixin: ReactCompositeComponentMixin};
  module.exports = ReactCompositeComponent;
})(require("process"));
