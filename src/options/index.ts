import {
  mixInto,
  diffArrays,
  forOwn,
  isFunction,
  isEmpty,
  isPlainObject,
  NOOP,
} from '../utility';
import {Option} from './types';


// internal representation of options for the mixing process;
// includes options specified in a IMixin as well as a IMixOptions
interface IOptions extends IMixOptions, IMixin {}

const DEFAULT_IMIX_OPTIONS: IOptions = {
  omit: [],
  adapterTo: {},
  premix: NOOP,
  adapterFrom: {},
  postmix: NOOP,
};

let checkMethodAdapters = function(
  key: string,
  adapters: Object,
  mixin: IMixin
): void {
  if (!isPlainObject(adapters)) {
    throw new TypeError(
      `${key}: expected dict of mixin methods to functions`);
  }
  forOwn(adapters, function(adapter: Function, fnName: string) {
    if (!isFunction(adapter)) {
      throw new TypeError(`${key}: value for ${fnName} isn't a function`);
    } else if (!isFunction(mixin[fnName])) {
      throw new Error(`${fnName} isn't a method on ${mixin}`);
    }
  });
};

let checkMixinFn = (key: string, fn: Function): void => {
  if (!isFunction(fn)) {
    throw new TypeError(`Expected a function for ${key}`);
  }
};

let checkOmit = (omit: string[], mixin: IMixin): void => {
  if (!Array.isArray(omit) || isEmpty(omit)) {
    throw new TypeError('Expected omit option to be a nonempty Array');
  }
  let diff = diffArrays(omit, Object.getOwnPropertyNames(mixin));
  if (!isEmpty(diff)) {
    throw new Error(`Some omit keys aren't in mixin: ${diff}`);
  }
};

let parseInlineOptions = (
  mixin: IMixin,
  options: Object,
  parsed: IOptions
): void => {
  forOwn(options, (value, key: string) => {
    switch (Option.fromKey(key)) {
      case (Option.Type.ADAPTER_TO):
        checkMethodAdapters(key, value, mixin);
        parsed.adapterTo = value;
        break;
      case (Option.Type.ADAPTER_FROM):
        checkMethodAdapters(key, value, mixin);
        parsed.adapterFrom = value;
        break;
      case (Option.Type.OMIT):
        checkOmit(value, mixin);
        parsed.omit = value;
        break;
    }
  });
};

let parse_mixins_options = (mixin: IMixin, parsed: IOptions): void => {
  forOwn(mixin, (value, key: string) => {
    switch (Option.fromKey(key)) {
      case (Option.Type.PRE_MIX):
        checkMixinFn(key, value);
        parsed.premix = value;
        break;
      case (Option.Type.POST_MIX):
        checkMixinFn(key, value);
        parsed.postmix = value;
        break;
    }
  });
};

export var parseIOptions = (options: Object, mixin: IMixin): IOptions => {
  if (!isPlainObject(options)) {
    throw new TypeError('Expected options dictionary');
  }
  let parsed: IOptions = mixInto({}, DEFAULT_IMIX_OPTIONS);
  parseInlineOptions(mixin, options, parsed);
  parse_mixins_options(mixin, parsed);
  return parsed;
};
