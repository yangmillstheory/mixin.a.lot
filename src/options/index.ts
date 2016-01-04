import * as _ from 'lodash';
import {OptionType, option_type_of} from './types';


const DEFAULT_MIX_OPTIONS: IMixOptions = {
  omits: [],
  pre_mixing_advice: _.noop,
  pre_method_advice: {},
  post_mixing_advice: _.noop,
  post_method_advice: {},
};

let assert_method_advice = (key: string, advice, mixin: Mixin): void => {
  if (!_.isPlainObject(advice)) {
    throw new TypeError(
      `${key}: expected dict of mixin methods to callbacks`);
  }
  _.forOwn(advice, (callback: Function, method_name: string) => {
    if (!_.isFunction(callback)) {
      throw new TypeError(`${key} for ${method_name} isn't a function`);
    } else if (!_.isFunction(mixin[method_name])) {
      throw new Error(`${method_name} isn't a method on ${mixin}`);
    }
  });
};

let assert_mixing_advice = (key: string, advice): void => {
  if (!_.isFunction(advice)) {
    throw new TypeError(`Expected a function for ${key}`);
  }
};

let assert_omits = (omits: string[], mixin: Mixin): void => {
  if (!Array.isArray(omits) || _.isEmpty(omits)) {
    throw new TypeError('Expected omits option to be a nonempty Array');
  }
  let diff = _.difference(omits, mixin.mixin_keys);
  if (diff.length) {
    throw new Error(`Some omit keys aren't in mixin: ${diff}`);
  }
};

export var parse_options = (options: Object, mixin: Mixin): IMixOptions => {
  if (!_.isPlainObject(options)) {
    throw new TypeError('Expected options dictionary');
  }
  let parsed: IMixOptions = _.clone(DEFAULT_MIX_OPTIONS);
  _.forOwn(options, (value, key: string) => {
    switch (option_type_of(key)) {
      case (OptionType.PRE_METHOD_ADVICE):
        assert_method_advice(key, value, mixin);
        parsed.pre_method_advice = value;
        break;
      case (OptionType.PRE_MIXING_ADVICE):
        assert_mixing_advice(key, value);
        parsed.pre_mixing_advice = value;
        break;
      case (OptionType.POST_METHOD_ADVICE):
        assert_method_advice(key, value, mixin);
        parsed.post_method_advice = value;
        break;
      case (OptionType.POST_MIXING_ADVICE):
        assert_mixing_advice(key, value);
        parsed.post_mixing_advice = value;
        break;
      case (OptionType.OMITS):
        assert_omits(value, mixin);
        parsed.omits = value;
        break;
    }
  });
  return parsed;
};
