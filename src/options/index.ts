import {
  copy_object,
  diff_arrays,
  for_own,
  is_function,
  is_empty,
  is_plain_object,
  NOOP,
} from '../utility';
import {Option} from './types';


// internal representation of options for the mixing process;
// includes options specified in a IMixin as well as a IMixOptions
interface IOptions extends IMixOptions, IMixin {}

const DEFAULT_IMIX_OPTIONS: IOptions = {
  omit: [],
  pre_method_advice: {},
  pre_mixing_hook: NOOP,
  post_method_advice: {},
  post_mixing_hook: NOOP,
};

let check_method_advice = (key: string, advice: Object, mixin: IMixin): void => {
  if (!is_plain_object(advice)) {
    throw new TypeError(
      `${key}: expected dict of mixin methods to callbacks`);
  }
  for_own(advice, (callback: Function, method_name: string) => {
    if (!is_function(callback)) {
      throw new TypeError(`${key} for ${method_name} isn't a function`);
    } else if (!is_function(mixin[method_name])) {
      throw new Error(`${method_name} isn't a method on ${mixin}`);
    }
  });
};

let check_mixing_hook = (key: string, hook: Function): void => {
  if (!is_function(hook)) {
    throw new TypeError(`Expected a function for ${key}`);
  }
};

let check_omit = (omit: string[], mixin: IMixin): void => {
  if (!Array.isArray(omit) || is_empty(omit)) {
    throw new TypeError('Expected omit option to be a nonempty Array');
  }
  let diff = diff_arrays(omit, Object.getOwnPropertyNames(mixin));
  if (!is_empty(diff)) {
    throw new Error(`Some omit keys aren't in mixin: ${diff}`);
  }
};

let parse_inline_options = (mixin: IMixin, options: Object,
                            parsed: IOptions): void => {
  for_own(options, (value, key: string) => {
    switch (Option.from_key(key)) {
      case (Option.Type.PRE_METHOD_ADVICE):
        check_method_advice(key, value, mixin);
        parsed.pre_method_advice = value;
        break;
      case (Option.Type.POST_METHOD_ADVICE):
        check_method_advice(key, value, mixin);
        parsed.post_method_advice = value;
        break;
      case (Option.Type.OMIT):
        check_omit(value, mixin);
        parsed.omit = value;
        break;
    }
  });
};

let parse_mixins_options = (mixin: IMixin, parsed: IOptions): void => {
  for_own(mixin, (value, key: string) => {
    switch (Option.from_key(key)) {
      case (Option.Type.PRE_MIXING_HOOK):
        check_mixing_hook(key, value);
        parsed.pre_mixing_hook = value;
        break;
      case (Option.Type.POST_MIXING_HOOK):
        check_mixing_hook(key, value);
        parsed.post_mixing_hook = value;
        break;
    }
  });
};

export var parse_ioptions = (options: Object, mixin: IMixin): IOptions => {
  if (!is_plain_object(options)) {
    throw new TypeError('Expected options dictionary');
  }
  let parsed: IOptions = copy_object({}, DEFAULT_IMIX_OPTIONS);
  parse_inline_options(mixin, options, parsed);
  parse_mixins_options(mixin, parsed);
  return parsed;
};
