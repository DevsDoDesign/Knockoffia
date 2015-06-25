/* */ 
var baseCompareAscending = require("./baseCompareAscending");
function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;
  while (++index < length) {
    var result = baseCompareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      return result * (orders[index] ? 1 : -1);
    }
  }
  return object.index - other.index;
}
module.exports = compareMultiple;
