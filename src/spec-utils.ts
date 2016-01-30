import {mixInto} from './utility';

export var loggerMixin = function(extensions: Object = {}) {
  return mixInto({log: new Function()}, extensions);
};
