import {mix_into} from './utility';

export var logger_mixin = (extensions: Object = {}) => {
  return mix_into(
    {
      log: new Function()
    },
    extensions);
};
