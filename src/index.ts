import {parse_ioptions} from './options';
import {
  compose,
  diff_arrays,
  is_empty,
  is_object,
  is_plain_object,
} from './utility';


const USAGE = (target?): string => {
  return `Expected non-null object, got ${target}`;
};

interface IAdapting {
  method: Function;
  pre_adapter: Function;
  post_adapter: Function;
  key: string;
}

export var mix = function(target: Object, mixin: IMixin, options: IMixOptions = {}) {
  ////////////////////////////
  // setup & pre-mixing checks
  if (target === undefined) {
    throw new TypeError(USAGE());
  } else if (!is_object(target)) {
    throw new TypeError(USAGE(target));
  }
  if (!is_plain_object(mixin)) {
    throw new TypeError('Expected mixin to be an object literal');
  }
  let {
    adapter_to,
    pre_mix,
    adapter_from,
    post_mix,
    omit,
  } = parse_ioptions(options, mixin);
  let keys_to_mix_in = diff_arrays(
    Object.getOwnPropertyNames(mixin).filter(key => {
      return (mixin[key] !== pre_mix) && (mixin[key] !== post_mix);
    }),
    omit);
  if (is_empty(keys_to_mix_in)) {
    throw new Error('All mixin keys have been omitted!');
  }

  ////////////////////
  // initialize mixing
  pre_mix.call(mixin, target);

  //////////////
  // perform mix
  let adaptings: IAdapting[] = [];
  keys_to_mix_in.forEach((key: string) => {
    let adapters = adapter_to[key] || adapter_from[key];
    if (adapters) {
      // defer attaching adapters until all other
      // data/behavior have been mixed in
      adaptings.push({
        key,
        pre_adapter: adapter_to[key],
        post_adapter: adapter_from[key],
        method: mixin[key],
      });
    } else  {
      target[key] = mixin[key];
    }
  });
  adaptings.forEach(adapting => {
    // attach adapters now
    let {pre_adapter, post_adapter, method, key} = adapting;
    if (pre_adapter) {
      target[key] = compose(method, pre_adapter, target);
      if (post_adapter) {
        target[key] = compose(post_adapter, target[key], target);
      }
    } else if (post_adapter) {
      target[key] = compose(post_adapter, method, target);
    }
  });

  //////////////////
  // finalize mixing
  post_mix.call(mixin, target);
  return target;
};
