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
  pre_adapters: {},
  pre_mix: NOOP,
  post_adapters: {},
  post_mix: NOOP,
};

let check_method_adapters = (key: string, adapters: Object, mixin: IMixin): void => {
  if (!is_plain_object(adapters)) {
    throw new TypeError(
      `${key}: expected dict of mixin methods to functions`);
  }
  for_own(adapters, (adapter: Function, fn_name: string) => {
    if (!is_function(adapter)) {
      throw new TypeError(`${key}: value for ${fn_name} isn't a function`);
    } else if (!is_function(mixin[fn_name])) {
      throw new Error(`${fn_name} isn't a method on ${mixin}`);
    }
  });
};

let check_mixing_fn = (key: string, fn: Function): void => {
  if (!is_function(fn)) {
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
      case (Option.Type.PRE_ADAPTERS):
        check_method_adapters(key, value, mixin);
        parsed.pre_adapters = value;
        break;
      case (Option.Type.POST_ADAPTERS):
        check_method_adapters(key, value, mixin);
        parsed.post_adapters = value;
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
      case (Option.Type.PRE_MIX):
        check_mixing_fn(key, value);
        parsed.pre_mix = value;
        break;
      case (Option.Type.POST_MIX):
        check_mixing_fn(key, value);
        parsed.post_mix = value;
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
