import {copy_object} from './utility';

export var logger_mixin = (extensions: Object = {}) => {
  return copy_object(
    {
      log: new Function()
    },
    extensions);
};
