/* */ 
(function(process) {
  'use strict';
  var BeforeInputEventPlugin = require("./BeforeInputEventPlugin");
  var ChangeEventPlugin = require("./ChangeEventPlugin");
  var ClientReactRootIndex = require("./ClientReactRootIndex");
  var DefaultEventPluginOrder = require("./DefaultEventPluginOrder");
  var EnterLeaveEventPlugin = require("./EnterLeaveEventPlugin");
  var ExecutionEnvironment = require("./ExecutionEnvironment");
  var HTMLDOMPropertyConfig = require("./HTMLDOMPropertyConfig");
  var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
  var ReactClass = require("./ReactClass");
  var ReactComponentBrowserEnvironment = require("./ReactComponentBrowserEnvironment");
  var ReactDefaultBatchingStrategy = require("./ReactDefaultBatchingStrategy");
  var ReactDOMComponent = require("./ReactDOMComponent");
  var ReactDOMButton = require("./ReactDOMButton");
  var ReactDOMForm = require("./ReactDOMForm");
  var ReactDOMImg = require("./ReactDOMImg");
  var ReactDOMIDOperations = require("./ReactDOMIDOperations");
  var ReactDOMIframe = require("./ReactDOMIframe");
  var ReactDOMInput = require("./ReactDOMInput");
  var ReactDOMOption = require("./ReactDOMOption");
  var ReactDOMSelect = require("./ReactDOMSelect");
  var ReactDOMTextarea = require("./ReactDOMTextarea");
  var ReactDOMTextComponent = require("./ReactDOMTextComponent");
  var ReactElement = require("./ReactElement");
  var ReactEventListener = require("./ReactEventListener");
  var ReactInjection = require("./ReactInjection");
  var ReactInstanceHandles = require("./ReactInstanceHandles");
  var ReactInstanceMap = require("./ReactInstanceMap");
  var ReactMount = require("./ReactMount");
  var ReactReconcileTransaction = require("./ReactReconcileTransaction");
  var SelectEventPlugin = require("./SelectEventPlugin");
  var ServerReactRootIndex = require("./ServerReactRootIndex");
  var SimpleEventPlugin = require("./SimpleEventPlugin");
  var SVGDOMPropertyConfig = require("./SVGDOMPropertyConfig");
  var createFullPageComponent = require("./createFullPageComponent");
  function autoGenerateWrapperClass(type) {
    return ReactClass.createClass({
      tagName: type.toUpperCase(),
      render: function() {
        var internalInstance = ReactInstanceMap.get(this);
        return new ReactElement(type, null, null, internalInstance._currentElement._owner, null, this.props);
      }
    });
  }
  var alreadyInjected = false;
  function inject() {
    if (alreadyInjected) {
      return ;
    }
    alreadyInjected = true;
    ReactInjection.EventEmitter.injectReactEventListener(ReactEventListener);
    ReactInjection.EventPluginHub.injectEventPluginOrder(DefaultEventPluginOrder);
    ReactInjection.EventPluginHub.injectInstanceHandle(ReactInstanceHandles);
    ReactInjection.EventPluginHub.injectMount(ReactMount);
    ReactInjection.EventPluginHub.injectEventPluginsByName({
      SimpleEventPlugin: SimpleEventPlugin,
      EnterLeaveEventPlugin: EnterLeaveEventPlugin,
      ChangeEventPlugin: ChangeEventPlugin,
      SelectEventPlugin: SelectEventPlugin,
      BeforeInputEventPlugin: BeforeInputEventPlugin
    });
    ReactInjection.NativeComponent.injectGenericComponentClass(ReactDOMComponent);
    ReactInjection.NativeComponent.injectTextComponentClass(ReactDOMTextComponent);
    ReactInjection.NativeComponent.injectAutoWrapper(autoGenerateWrapperClass);
    ReactInjection.Class.injectMixin(ReactBrowserComponentMixin);
    ReactInjection.NativeComponent.injectComponentClasses({
      'button': ReactDOMButton,
      'form': ReactDOMForm,
      'iframe': ReactDOMIframe,
      'img': ReactDOMImg,
      'input': ReactDOMInput,
      'option': ReactDOMOption,
      'select': ReactDOMSelect,
      'textarea': ReactDOMTextarea,
      'html': createFullPageComponent('html'),
      'head': createFullPageComponent('head'),
      'body': createFullPageComponent('body')
    });
    ReactInjection.DOMProperty.injectDOMPropertyConfig(HTMLDOMPropertyConfig);
    ReactInjection.DOMProperty.injectDOMPropertyConfig(SVGDOMPropertyConfig);
    ReactInjection.EmptyComponent.injectEmptyComponent('noscript');
    ReactInjection.Updates.injectReconcileTransaction(ReactReconcileTransaction);
    ReactInjection.Updates.injectBatchingStrategy(ReactDefaultBatchingStrategy);
    ReactInjection.RootIndex.injectCreateReactRootIndex(ExecutionEnvironment.canUseDOM ? ClientReactRootIndex.createReactRootIndex : ServerReactRootIndex.createReactRootIndex);
    ReactInjection.Component.injectEnvironment(ReactComponentBrowserEnvironment);
    ReactInjection.DOMComponent.injectIDOperations(ReactDOMIDOperations);
    if ('production' !== process.env.NODE_ENV) {
      var url = ExecutionEnvironment.canUseDOM && window.location.href || '';
      if (/[?&]react_perf\b/.test(url)) {
        var ReactDefaultPerf = require("./ReactDefaultPerf");
        ReactDefaultPerf.start();
      }
    }
  }
  module.exports = {inject: inject};
})(require("process"));
