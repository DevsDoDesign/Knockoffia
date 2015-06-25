/* */ 
(function(process) {
  'use strict';
  var ReactElement = require("./ReactElement");
  var ReactFragment = require("./ReactFragment");
  var ReactInstanceHandles = require("./ReactInstanceHandles");
  var getIteratorFn = require("./getIteratorFn");
  var invariant = require("./invariant");
  var warning = require("./warning");
  var SEPARATOR = ReactInstanceHandles.SEPARATOR;
  var SUBSEPARATOR = ':';
  var userProvidedKeyEscaperLookup = {
    '=': '=0',
    '.': '=1',
    ':': '=2'
  };
  var userProvidedKeyEscapeRegex = /[=.:]/g;
  var didWarnAboutMaps = false;
  function userProvidedKeyEscaper(match) {
    return userProvidedKeyEscaperLookup[match];
  }
  function getComponentKey(component, index) {
    if (component && component.key != null) {
      return wrapUserProvidedKey(component.key);
    }
    return index.toString(36);
  }
  function escapeUserProvidedKey(text) {
    return ('' + text).replace(userProvidedKeyEscapeRegex, userProvidedKeyEscaper);
  }
  function wrapUserProvidedKey(key) {
    return '$' + escapeUserProvidedKey(key);
  }
  function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
    var type = typeof children;
    if (type === 'undefined' || type === 'boolean') {
      children = null;
    }
    if (children === null || type === 'string' || type === 'number' || ReactElement.isValidElement(children)) {
      callback(traverseContext, children, nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
      return 1;
    }
    var child;
    var nextName;
    var subtreeCount = 0;
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        child = children[i];
        nextName = (nameSoFar !== '' ? nameSoFar + SUBSEPARATOR : SEPARATOR) + getComponentKey(child, i);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else {
      var iteratorFn = getIteratorFn(children);
      if (iteratorFn) {
        var iterator = iteratorFn.call(children);
        var step;
        if (iteratorFn !== children.entries) {
          var ii = 0;
          while (!(step = iterator.next()).done) {
            child = step.value;
            nextName = (nameSoFar !== '' ? nameSoFar + SUBSEPARATOR : SEPARATOR) + getComponentKey(child, ii++);
            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
          }
        } else {
          if ('production' !== process.env.NODE_ENV) {
            'production' !== process.env.NODE_ENV ? warning(didWarnAboutMaps, 'Using Maps as children is not yet fully supported. It is an ' + 'experimental feature that might be removed. Convert it to a ' + 'sequence / iterable of keyed ReactElements instead.') : undefined;
            didWarnAboutMaps = true;
          }
          while (!(step = iterator.next()).done) {
            var entry = step.value;
            if (entry) {
              child = entry[1];
              nextName = (nameSoFar !== '' ? nameSoFar + SUBSEPARATOR : SEPARATOR) + wrapUserProvidedKey(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0);
              subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
            }
          }
        }
      } else if (type === 'object') {
        !(children.nodeType !== 1) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'traverseAllChildren(...): Encountered an invalid child; DOM ' + 'elements are not valid children of React components.') : invariant(false) : undefined;
        var fragment = ReactFragment.extract(children);
        for (var key in fragment) {
          if (fragment.hasOwnProperty(key)) {
            child = fragment[key];
            nextName = (nameSoFar !== '' ? nameSoFar + SUBSEPARATOR : SEPARATOR) + wrapUserProvidedKey(key) + SUBSEPARATOR + getComponentKey(child, 0);
            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
          }
        }
      }
    }
    return subtreeCount;
  }
  function traverseAllChildren(children, callback, traverseContext) {
    if (children == null) {
      return 0;
    }
    return traverseAllChildrenImpl(children, '', callback, traverseContext);
  }
  module.exports = traverseAllChildren;
})(require("process"));
