/* */ 
(function(process) {
  'use strict';
  var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");
  var accumulateInto = require("./accumulateInto");
  var findDOMNode = require("./findDOMNode");
  var forEachAccumulated = require("./forEachAccumulated");
  var invariant = require("./invariant");
  function remove(event) {
    event.remove();
  }
  var LocalEventTrapMixin = {
    trapBubbledEvent: function(topLevelType, handlerBaseName) {
      !this.isMounted() ? 'production' !== process.env.NODE_ENV ? invariant(false, 'Must be mounted to trap events') : invariant(false) : undefined;
      var node = findDOMNode(this);
      !node ? 'production' !== process.env.NODE_ENV ? invariant(false, 'LocalEventTrapMixin.trapBubbledEvent(...): Requires node to be rendered.') : invariant(false) : undefined;
      var listener = ReactBrowserEventEmitter.trapBubbledEvent(topLevelType, handlerBaseName, node);
      this._localEventListeners = accumulateInto(this._localEventListeners, listener);
    },
    componentWillUnmount: function() {
      if (this._localEventListeners) {
        forEachAccumulated(this._localEventListeners, remove);
      }
    }
  };
  module.exports = LocalEventTrapMixin;
})(require("process"));
